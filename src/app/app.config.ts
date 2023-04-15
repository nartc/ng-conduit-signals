import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
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
            withComponentInputBinding()
        ),
        provideHttpClient(withInterceptors([authInterceptor()])),
        provideClientHydration(),
    ],
};
