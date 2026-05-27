import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'register-list',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/register-list/register-list.page').then((m) => m.RegisterListPage),
      },
    ],
  },
  {
    path: 'otp',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/otp/otp.page').then((m) => m.OtpPage),
  },
  {
    path: '',
    canActivateChild: [authChildGuard],
    loadComponent: () =>
      import('./layouts/app-shell/app-shell.layout').then((m) => m.AppShellLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
