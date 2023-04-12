import { Routes } from '@angular/router';
import { provideProfileArticlesType } from '../feature-profile-articles/profile-articles.di';

export default [
    {
        path: '',
        loadComponent: () => import('./profile.component'),
        children: [
            {
                path: '',
                providers: [provideProfileArticlesType('my')],
                loadComponent: () => import('../feature-profile-articles/profile-articles.component'),
            },
            {
                path: 'favorites',
                providers: [provideProfileArticlesType('favorites')],
                loadComponent: () => import('../feature-profile-articles/profile-articles.component'),
            },
        ],
    },
] as Routes;
