import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  if (authService.isSessionExpired()) {
    authService.logout();
    return false;
  }

  authService.updateActivity();

  return true;
};