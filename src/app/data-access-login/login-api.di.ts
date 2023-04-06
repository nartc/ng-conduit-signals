import { DestroyRef, InjectionToken } from '@angular/core';
import { UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AUTH_API } from '../shared-data-access-auth/auth-api.di';
import { FORM_ERRORS_API, provideFormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.di';
import { LoginApi, loginApiFactory } from './login-api.factory';

export const LOGIN_API = new InjectionToken<LoginApi>('Login API');

export function provideLoginApi() {
    return [
        provideFormErrorsApi(),
        {
            provide: LOGIN_API,
            useFactory: loginApiFactory,
            deps: [AUTH_API, FORM_ERRORS_API, UserAndAuthenticationApiClient, DestroyRef],
        },
    ];
}
