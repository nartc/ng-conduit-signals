import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./new-article/new-article.component'),
        title: 'New Article',
    },
    {
        path: ':slug',
        loadComponent: () => import('./edit-article/edit-article.component'),
        title: 'Edit Article',
    },
] as Routes;
