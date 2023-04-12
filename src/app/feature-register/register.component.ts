import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewUser } from '../shared-data-access-api';
import { FormErrorsService } from '../shared-data-access-form-errors/form-errors.service';
import { SharedUiFormErrors } from '../shared-ui/form-errors/form-errors.component';
import { SharedUiFormLayout } from '../shared-ui/form-layout/form-layout.component';
import { RegisterService } from './register.service';

@Component({
    standalone: true,
    template: `
        <app-shared-ui-form-layout class="auth-page" innerClass="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign up</h1>
            <p class="text-xs-center">
                <a routerLink="/login">Have an account?</a>
            </p>

            <app-shared-ui-form-errors [errors]="registerService.errors()" />

            <form #form="ngForm" (ngSubmit)="registerService.register(newUser)">
                <fieldset class="form-group">
                    <input
                        [(ngModel)]="newUser.username"
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Username"
                        name="username"
                        required
                    />
                </fieldset>
                <fieldset class="form-group">
                    <input
                        [(ngModel)]="newUser.email"
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        name="email"
                        required
                        email
                    />
                </fieldset>
                <fieldset class="form-group">
                    <input
                        [(ngModel)]="newUser.password"
                        class="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                </fieldset>
                <button
                    type="submit"
                    class="btn btn-lg btn-primary pull-xs-right"
                    [disabled]="!form.valid || registerService.isLoading()"
                >
                    Sign up
                </button>
            </form>
        </app-shared-ui-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SharedUiFormLayout, SharedUiFormErrors, NgIf, NgFor, RouterLink, FormsModule],
    providers: [RegisterService, FormErrorsService],
})
export default class Register {
    protected readonly registerService = inject(RegisterService);

    protected newUser: NewUser = { username: '', email: '', password: '' };
}
