import { DestroyRef, InjectionToken, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileApiClient, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthApi, authApiFactory } from './auth-api.factory';

export const AUTH_API = new InjectionToken<AuthApi>('Auth API', {
    factory: () => {
        const userAndAuthenticateApiClient = inject(UserAndAuthenticationApiClient);
        const profileApiClient = inject(ProfileApiClient);
        const router = inject(Router);
        const destroyRef = inject(DestroyRef);

        return authApiFactory(userAndAuthenticateApiClient, profileApiClient, router, destroyRef);
    },
});
