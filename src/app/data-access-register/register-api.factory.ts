import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NewUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthApi } from '../shared-data-access-auth/auth-api.factory';
import { FormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.factory';
import { ApiStatus } from '../shared-data-access-models/api-status';

export function registerApiFactory(
    formErrorsApi: FormErrorsApi,
    authApi: AuthApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient
) {
    const status = signal<ApiStatus>('idle');

    return {
        register: (data: NewUser) => {
            status.set('loading');
            lastValueFrom(userAndAuthenticationApiClient.createUser({ body: { user: data } }))
                .then((response) => {
                    status.set('success');
                    localStorage.setItem('ng-conduit-signals-token', response.user.token);
                    localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                    authApi.authenticate();
                })
                .catch(({ error }: HttpErrorResponse) => {
                    status.set('error');
                    console.error('error registering new user: ', error);
                    if (error.errors) {
                        formErrorsApi.updateErrors(error.errors);
                    }
                });
        },
        isLoading: () => status() === 'loading',
        errors: formErrorsApi.formErrors,
    };
}

export type RegisterApi = ReturnType<typeof registerApiFactory>;
