import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const permiso = route.data?.['permission'];
  const accion = route.data?.['action'] || 'puede_ver';

  if (!permiso) return true;

  if (auth.hasPermission(permiso, accion)) {
    return true;
  }

  router.navigate(['/dashboard'], { replaceUrl: true });
  return false;
};