import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { LoginUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FormErrorsService } from '../shared-data-access-form-errors/form-errors.service';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class LoginService {
    readonly #userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
    readonly #authService = inject(AuthService);
    readonly #formErrorsService = inject(FormErrorsService);

    readonly #status = signal<ApiStatus>('idle');

    readonly isLoading = computed(() => this.#status() === 'loading');
    readonly errors = this.#formErrorsService.formErrors;

    login(data: LoginUser) {
        this.#status.set('loading');
        this.#userAndAuthenticationApiClient
            .login({ body: { user: data } })
            .then((response) => {
                this.#status.set('success');
                localStorage.setItem('ng-conduit-signals-token', response.user.token);
                localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                this.#authService.authenticate();
            })
            .catch(({ error }: HttpErrorResponse) => {
                this.#status.set('error');
                console.error('error login user: ', error);
                if (error.errors) {
                    this.#formErrorsService.setErrors(error.errors);
                }
            });
    }
}
