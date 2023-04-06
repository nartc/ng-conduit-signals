import { Routes } from '@angular/router';
import { nonAuthGuard } from '../shared-data-access-auth/non-auth.guard';

export default [
    {
        path: '',
        loadComponent: () => import('../feature-home/home.component'),
    },
    {
        path: 'register',
        canMatch: [nonAuthGuard()],
        loadComponent: () => import('../feature-register/register.component'),
    },
    {
        path: 'login',
        canMatch: [nonAuthGuard()],
        loadComponent: () => import('../feature-login/login.component'),
    },
] as Routes;
