import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, signal } from '@angular/core';
import { fromSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, exhaustMap, of, skip, tap } from 'rxjs';
import { LoginUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthApi } from '../shared-data-access-auth/auth-api.factory';
import { FormErrorsApi } from '../shared-data-access-form-errors/form-errors-api.factory';

export function loginApiFactory(
    authApi: AuthApi,
    formErrorsApi: FormErrorsApi,
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    destroyRef: DestroyRef
) {
    const loginUser = signal<LoginUser>({} as LoginUser);

    fromSignal(loginUser)
        .pipe(
            skip(1),
            exhaustMap((user) =>
                userAndAuthenticationApiClient.login({ body: { user } }).pipe(
                    tap({
                        next: (response) => {
                            localStorage.setItem('ng-conduit-signals-token', response.user.token);
                            localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                            authApi.authenticate();
                        },
                        error: ({ error }: HttpErrorResponse) => {
                            console.error('error login user: ', error);
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
        login: (data: LoginUser) => loginUser.set(data),
        errors: formErrorsApi.formErrors,
    };
}

export type LoginApi = ReturnType<typeof loginApiFactory>;
