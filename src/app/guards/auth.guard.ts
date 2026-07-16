import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { TokenService } from '../context/token.service';

/**
 * Allow navigation if access token is valid.
 * If expired/missing, silently refresh via httpOnly refresh cookie first —
 * only redirect to login when refresh fails.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token && !tokenService.isTokenExpired(token)) {
    return true;
  }

  return tokenService.refreshTokenObservable$().pipe(
    map(() => true),
    catchError(() => {
      tokenService.clearTokens();
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }),
  );
};
