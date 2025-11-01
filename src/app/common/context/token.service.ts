import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ApiAuthServices } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private apiAuthService: ApiAuthServices
  ) {}

  /**
   * Kiểm tra xem token có hết hạn không
   */
  isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch (error) {
      return true;
    }
  }

  /**
   * Tự động refresh token khi hết hạn
   */
  refreshToken(): Observable<string> {
    if (this.refreshTokenInProgress) {
      // Nếu đang refresh, chờ kết quả
      return this.refreshTokenSubject.asObservable();
    }

    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      this.authService.logout();
      return throwError('No refresh token available');
    }

    this.refreshTokenInProgress = true;

    return this.apiAuthService.refreshToken(refreshToken).pipe(
      tap((response: any) => {
        // Lưu token mới
        this.authService.setToken(response.access_token);
        
        // Nếu có refresh token mới, lưu lại
        if (response.refresh_token) {
          this.authService.setRefreshToken(response.refresh_token);
        }

        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(response.access_token as string | null);
      }),
      catchError(error => {
        this.refreshTokenInProgress = false;
        this.authService.logout();
        return throwError(error);
      })
    );
  }

  /**
   * Lấy token hợp lệ, tự động refresh nếu cần
   */
  getValidToken(): Observable<string> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError('No token available');
    }

    if (this.isTokenExpired(token)) {
      return this.refreshToken().pipe(
        switchMap((newToken: string) => {
          return new Observable<string>(observer => {
            observer.next(newToken);
            observer.complete();
          });
        })
      );
    }

    return new Observable(observer => {
      observer.next(token);
      observer.complete();
    });
  }

  /**
   * Thiết lập auto refresh timer
   */
  setupAutoRefresh(): void {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      
      // Refresh token 5 phút trước khi hết hạn
      const refreshTime = expiry - now - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        timer(refreshTime).subscribe(() => {
          this.refreshToken().subscribe(
            () => {
              console.log('Token refreshed automatically');
              this.setupAutoRefresh(); // Setup next refresh
            },
            error => {
              console.error('Auto refresh failed:', error);
            }
          );
        });
      }
    } catch (error) {
      console.error('Error setting up auto refresh:', error);
    }
  }
}
