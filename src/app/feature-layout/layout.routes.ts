import { Routes } from '@angular/router';
import { authGuard } from '../shared-data-access-auth/auth.guard';

export default [
    {
        path: '',
        loadComponent: () => import('../feature-home/home.component'),
    },
    {
        path: 'settings',
        canMatch: [authGuard('protected')],
        loadComponent: () => import('../feature-settings/settings.component'),
    },
    {
        path: 'register',
        canMatch: [authGuard('unprotected')],
        loadComponent: () => import('../feature-register/register.component'),
    },
    {
        path: 'login',
        canMatch: [authGuard('unprotected')],
        loadComponent: () => import('../feature-login/login.component'),
    },
] as Routes;
