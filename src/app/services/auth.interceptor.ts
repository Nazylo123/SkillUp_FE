import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { TokenService } from '../context/token.service';
import { LoadingService } from '../context/loading.service';

const AUTH_SKIP_PATHS = [
  '/Auth/login',
  '/Auth/refresh-token',
  '/Auth/refresh-token-only',
  '/Auth/forgot-password',
  '/Auth/verify-otp',
  '/Auth/reset-password',
  '/Auth/google',
];

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function isAuthEndpoint(url: string): boolean {
  return AUTH_SKIP_PATHS.some((path) => url.includes(path));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  loadingService.onLoading();

  if (isAuthEndpoint(req.url)) {
    return next(req).pipe(finalize(() => loadingService.offLoading()));
  }

  const token = tokenService.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    finalize(() => loadingService.offLoading()),
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Already refreshing — wait for the new token then retry once
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((t): t is string => !!t),
          take(1),
          switchMap((newToken) =>
            next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              }),
            ),
          ),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return tokenService.refreshTokenObservable$().pipe(
        switchMap((newToken: string) => {
          isRefreshing = false;
          refreshTokenSubject.next(newToken);
          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            }),
          );
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);
          tokenService.clearTokens();
          const returnUrl = router.url?.startsWith('/login') ? undefined : router.url;
          router.navigate(['/login'], {
            queryParams: returnUrl ? { returnUrl } : undefined,
          });
          // Swallow noisy HttpErrorResponse so UI doesn't show "[object Object]"
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
