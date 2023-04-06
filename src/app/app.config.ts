import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { ApiConfiguration } from './shared-data-access-api';
import { authInterceptor } from './shared-data-access-auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ApiConfiguration, useValue: { rootUrl: 'https://api.realworld.io/api' } },
        provideRouter(
            [
                {
                    path: '',
                    loadComponent: () => import('./feature-layout/layout.component'),
                    loadChildren: () => import('./feature-layout/layout.routes'),
                },
            ],
            withHashLocation(),
            withComponentInputBinding()
        ),
        provideHttpClient(withInterceptors([authInterceptor()])),
    ],
};
