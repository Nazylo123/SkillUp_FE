import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, throwError, timer } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ApiAuthServices } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private cookieService = inject(CookieService);
  private apiAuthService = inject(ApiAuthServices);

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenObservable: Observable<string> | null = null;
  private autoRefreshSub: Subscription | null = null;

  /** Check if JWT is expired (with 30s skew so we refresh before hard expiry). */
  isTokenExpired(token: string | null, skewMs = 30_000): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry - skewMs;
    } catch {
      return true;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const msRole =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (Array.isArray(msRole)) return msRole[0] ?? null;
      if (typeof msRole === 'string') return msRole;
      if (Array.isArray(payload.roles)) return payload.roles[0] ?? null;
      if (typeof payload.role === 'string') return payload.role;
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token via httpOnly refresh cookie.
   * Concurrent callers share one in-flight request.
   * Emits the new accessToken string (not the whole response).
   */
  refreshTokenObservable$(): Observable<string> {
    if (this.refreshTokenObservable) {
      return this.refreshTokenObservable;
    }

    this.refreshTokenObservable = this.apiAuthService.refreshToken().pipe(
      map((response: { accessToken: string; accessTokenExpiry: number | string }) => {
        if (!response?.accessToken) {
          throw new Error('Refresh response missing accessToken');
        }
        this.setToken(response.accessToken, response.accessTokenExpiry);
        this.refreshTokenSubject.next(response.accessToken);
        this.setupAutoRefresh();
        return response.accessToken;
      }),
      catchError((error) => {
        this.refreshTokenSubject.next(null);
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshTokenObservable = null;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    return this.refreshTokenObservable;
  }

  /** Kick off refresh if current token is missing/expired (fire-and-forget). */
  getValidToken(): void {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.refreshTokenObservable$().subscribe({ error: () => undefined });
    }
  }

  /** Schedule silent refresh ~2 minutes before access token expires. */
  setupAutoRefresh(): void {
    this.autoRefreshSub?.unsubscribe();
    this.autoRefreshSub = null;

    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const refreshIn = expiry - Date.now() - 2 * 60 * 1000;

      this.autoRefreshSub = timer(Math.max(refreshIn, 0)).subscribe(() => {
        this.refreshTokenObservable$().subscribe({ error: () => undefined });
      });
    } catch {
      // ignore malformed token
    }
  }

  setToken(token: string, accessTokenExpiry: string | number) {
    const expiryMs = Number(accessTokenExpiry) * 1000;
    const expires = Number.isFinite(expiryMs) && expiryMs > 0
      ? new Date(expiryMs)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Secure+None only works on HTTPS; localhost HTTP needs Lax + non-secure
    const isHttps =
      typeof window !== 'undefined' && window.location.protocol === 'https:';

    this.cookieService.set('accessToken', token, {
      path: '/',
      secure: isHttps,
      sameSite: isHttps ? 'None' : 'Lax',
      expires,
    });
  }

  getToken(): string | null {
    const token = this.cookieService.get('accessToken');
    return token || null;
  }

  clearTokens() {
    this.autoRefreshSub?.unsubscribe();
    this.autoRefreshSub = null;
    this.refreshTokenObservable = null;
    this.refreshTokenSubject.next(null);
    this.cookieService.delete('accessToken', '/');
  }
}
