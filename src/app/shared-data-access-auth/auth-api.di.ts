import { DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileApiClient, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { authApiFactory } from './auth-api.factory';

export const [injectAuthApi, _, AUTH_API] = createInjectionToken(authApiFactory, {
    deps: [UserAndAuthenticationApiClient, ProfileApiClient, Router, DestroyRef],
});
