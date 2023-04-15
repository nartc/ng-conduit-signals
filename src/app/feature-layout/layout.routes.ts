import { Routes } from '@angular/router';
import { authGuard } from '../shared-data-access-auth/auth.guard';

export default [
    {
        path: '',
        loadComponent: () => import('../feature-home/home.component'),
        data: { revalidate: 60 },
        title: 'Home',
    },
    {
        path: 'settings',
        canMatch: [authGuard('protected')],
        loadComponent: () => import('../feature-settings/settings.component'),
        title: 'Settings',
    },
    {
        path: 'editor',
        canMatch: [authGuard('protected')],
        loadChildren: () => import('../feature-editor/editor.routes'),
    },
    {
        path: 'profile/:username',
        canMatch: [authGuard('protected')],
        loadChildren: () => import('../feature-profile/profile.routes'),
    },
    {
        path: 'article/:slug',
        canMatch: [authGuard('protected')],
        loadComponent: () => import('../feature-article/article.component'),
        data: { revalidate: 60 },
    },
    {
        path: 'register',
        canMatch: [authGuard('unprotected')],
        loadComponent: () => import('../feature-register/register.component'),
        data: { revalidate: 60 },
        title: 'Sign up',
    },
    {
        path: 'login',
        canMatch: [authGuard('unprotected')],
        loadComponent: () => import('../feature-login/login.component'),
        data: { revalidate: 60 },
        title: 'Sign in',
    },
] as Routes;
