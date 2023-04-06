import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, signal } from '@angular/core';
import { fromSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, exhaustMap, of, skip, tap } from 'rxjs';
import { NewUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthApi } from '../shared-data-access-auth/auth-api.factory';
import { FormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.factory';

export function registerApiFactory(
    formErrorsApi: FormErrorsApi,
    authApi: AuthApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    destroyRef: DestroyRef
) {
    const newUser = signal<NewUser>({} as NewUser);

    fromSignal(newUser)
        .pipe(
            skip(1),
            exhaustMap((user) =>
                userAndAuthenticationApiClient.createUser({ body: { user } }).pipe(
                    tap({
                        next: (response) => {
                            localStorage.setItem('ng-conduit-signals-token', response.user.token);
                            localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                            authApi.authenticate();
                        },
                        error: ({ error }: HttpErrorResponse) => {
                            console.error('error registering new user: ', error);
                            if (error.errors) {
                                formErrorsApi.updateErrors(error.errors);
                            }
                        },
                    }),
                    catchError(() => of(EMPTY))
                )
            ),
            takeUntilDestroyed(destroyRef)
        )
        .subscribe();

    return {
        register: (data: NewUser) => newUser.set(data),
        errors: formErrorsApi.formErrors,
    };
}

export type RegisterApi = ReturnType<typeof registerApiFactory>;
