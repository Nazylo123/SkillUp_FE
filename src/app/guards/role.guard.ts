import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../context/auth.service';
import { map, take } from 'rxjs/operators';
import { TokenService } from '../context/token.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const expectedRoles = route.data['roles'] as string[];
  const role = tokenService.getRole();
  if (!role) {
    router.navigate(['/login']);
    return false;
  }
  if (!expectedRoles.includes(role)) {
    if (role === 'Admin') {
      router.navigate(['/admin']);
    } else if (role === 'Manager') {
      router.navigate(['/manager']);
    } else if (role === 'Lecturer') {
      router.navigate(['/lecturer']);
    } else if (role === 'Employee') {
      router.navigate(['/']);
    }
    return false;
  }
  return true;
};
