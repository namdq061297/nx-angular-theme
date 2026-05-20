import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

const redirectIfUnauthenticated = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return authState.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export const authGuard: CanActivateFn = () => redirectIfUnauthenticated();

export const authChildGuard: CanActivateChildFn = () => redirectIfUnauthenticated();
