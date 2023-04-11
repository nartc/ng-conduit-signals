import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { LoginUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthApi } from '../shared-data-access-auth/auth-api.factory';
import { FormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.factory';
import { ApiStatus } from '../shared-data-access-models/api-status';

export function loginApiFactory(
    authApi: AuthApi,
    formErrorsApi: FormErrorsApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient
) {
    const status = signal<ApiStatus>('idle');

    return {
        login: (data: LoginUser) => {
            status.set('loading');
            lastValueFrom(userAndAuthenticationApiClient.login({ body: { user: data } }))
                .then((response) => {
                    status.set('success');
                    localStorage.setItem('ng-conduit-signals-token', response.user.token);
                    localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                    authApi.authenticate();
                })
                .catch(({ error }: HttpErrorResponse) => {
                    status.set('error');
                    console.error('error login user: ', error);
                    if (error.errors) {
                        formErrorsApi.updateErrors(error.errors);
                    }
                });
        },
        isLoading: () => status() === 'loading',
        errors: formErrorsApi.formErrors,
    };
}

export type LoginApi = ReturnType<typeof loginApiFactory>;
