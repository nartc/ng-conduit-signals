import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectRegisterApi, provideRegisterApi } from '../data-access-register/register-api.di';
import { NewUser } from '../shared-data-access-api';
import { SharedUiFormErrors } from '../shared-ui/form-errors/form-errors.component';
import { SharedUiFormLayout } from '../shared-ui/form-layout/form-layout.component';

@Component({
    standalone: true,
    template: `
        <app-shared-ui-form-layout class="auth-page" innerClass="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign up</h1>
            <p class="text-xs-center">
                <a routerLink="/login">Have an account?</a>
            </p>

            <app-shared-ui-form-errors [errors]="registerApi.errors()" />

            <form #form="ngForm" (ngSubmit)="submit()">
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
                <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="!form.valid">
                    Sign up
                </button>
            </form>
        </app-shared-ui-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SharedUiFormLayout, SharedUiFormErrors, NgIf, NgFor, RouterLink, FormsModule],
    providers: [provideRegisterApi()],
})
export default class Register {
    protected readonly registerApi = injectRegisterApi();

    protected newUser: NewUser = {
        username: '',
        email: '',
        password: '',
    };

    submit() {
        this.registerApi.register(this.newUser);
    }
}
