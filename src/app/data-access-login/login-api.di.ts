import { DestroyRef } from '@angular/core';
import { UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AUTH_API } from '../shared-data-access-auth/auth-api.di';
import { FORM_ERRORS_API, provideFormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.di';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { loginApiFactory } from './login-api.factory';

export const [injectLoginApi, provideLoginApi] = createInjectionToken(loginApiFactory, {
    deps: [AUTH_API, FORM_ERRORS_API, UserAndAuthenticationApiClient, DestroyRef],
    isRoot: false,
    extraProviders: provideFormErrorsApi(),
});
