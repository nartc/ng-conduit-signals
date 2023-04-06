import { DestroyRef, InjectionToken } from '@angular/core';
import { UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AUTH_API } from '../shared-data-access-auth/auth-api.di';
import { FORM_ERRORS_API, provideFormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.di';
import { RegisterApi, registerApiFactory } from './register-api.factory';

export const REGISTER_API = new InjectionToken<RegisterApi>('Register API');

export function provideRegisterApi() {
    return [
        provideFormErrorsApi(),
        {
            provide: REGISTER_API,
            useFactory: registerApiFactory,
            deps: [FORM_ERRORS_API, AUTH_API, UserAndAuthenticationApiClient, DestroyRef],
        },
    ];
}
