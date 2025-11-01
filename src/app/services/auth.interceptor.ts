import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../common/context/token.service';
import { AuthService } from '../common/context/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  
  // Skip token for auth endpoints
  const isAuthEndpoint = req.url.includes('/Auth/login') || 
                        req.url.includes('/Auth/refresh-token');
  
  if (isAuthEndpoint) {
    return next(req);
  }

  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // If token expired (401), try to refresh
        if (error.status === 401 && !req.url.includes('/Auth/refresh-token')) {
          return tokenService.refreshToken().pipe(
            switchMap(() => {
              // Retry original request with new token
              const newToken = authService.getToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // Refresh failed, logout user
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
