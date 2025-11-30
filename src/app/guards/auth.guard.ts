import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../context/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

    if (tokenService.isTokenExpired(tokenService.getToken())) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

