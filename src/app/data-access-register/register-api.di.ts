import { UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AUTH_API } from '../shared-data-access-auth/auth-api.di';
import { FORM_ERRORS_API, provideFormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.di';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { registerApiFactory } from './register-api.factory';

export const [injectRegisterApi, provideRegisterApi] = createInjectionToken(registerApiFactory, {
    deps: [FORM_ERRORS_API, AUTH_API, UserAndAuthenticationApiClient],
    isRoot: false,
    extraProviders: provideFormErrorsApi(),
});
