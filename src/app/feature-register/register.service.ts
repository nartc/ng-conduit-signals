import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NewUser, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FormErrorsService } from '../shared-data-access-form-errors/form-errors.service';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class RegisterService {
    private readonly userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
    private readonly authService = inject(AuthService);
    private readonly formErrorsService = inject(FormErrorsService);

    private readonly status = signal<ApiStatus>('idle');

    readonly vm = {
        errors: this.formErrorsService.vm.formErrors,
        isLoading: () => this.status() === 'loading',
    };

    register(data: NewUser) {
        this.status.set('loading');
        lastValueFrom(this.userAndAuthenticationApiClient.createUser({ body: { user: data } }))
            .then((response) => {
                this.status.set('success');
                localStorage.setItem('ng-conduit-signals-token', response.user.token);
                localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response.user));
                this.authService.authenticate();
            })
            .catch(({ error }: HttpErrorResponse) => {
                this.status.set('error');
                console.error('error registering new user: ', error);
                if (error.errors) {
                    this.formErrorsService.setErrors(error.errors);
                }
            });
    }
}
