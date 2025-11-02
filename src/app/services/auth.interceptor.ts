import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../common/context/token.service';
import { LoadingService } from '../common/context/loading.service';
import { AuthService } from '../common/context/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const loadingService = inject(LoadingService);
  const authService = inject(AuthService);
  
  // Skip token for auth endpoints
  const isAuthEndpoint = req.url.includes('/Auth/login') || req.url.includes('/Auth/refresh-token');
  
  loadingService.onLoading();
  if (isAuthEndpoint) {
    return next(req).pipe(
      finalize(() => {
        loadingService.offLoading();
      })
    );
  }

    const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    
    return next(cloned).pipe(
      finalize(() => {
        loadingService.offLoading();
      }),
      
      catchError((error: HttpErrorResponse) => {
        // If token expired (401), try to refresh
        if (error.status === 401 && !req.url.includes('/Auth/refresh-token')) {
          tokenService.refreshToken();
          const newToken = authService.getToken();
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(retryReq);
        }
        
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
