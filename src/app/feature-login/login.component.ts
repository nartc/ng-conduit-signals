import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectLoginApi, provideLoginApi } from '../data-access-login/login-api.di';
import { LoginUser } from '../shared-data-access-api';
import { SharedUiFormErrors } from '../shared-ui/form-errors/form-errors.component';
import { SharedUiFormLayout } from '../shared-ui/form-layout/form-layout.component';

@Component({
    standalone: true,
    template: `
        <app-shared-ui-form-layout class="auth-page" innerClass="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
                <a routerLink="/register">Need an account?</a>
            </p>

            <app-shared-ui-form-errors [errors]="loginApi.errors()" />

            <form #form="ngForm" (ngSubmit)="submit()">
                <fieldset class="form-group">
                    <input
                        [(ngModel)]="loginUser.email"
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
                        [(ngModel)]="loginUser.password"
                        class="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        name="password"
                        password
                    />
                </fieldset>
                <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="!form.valid">
                    Sign in
                </button>
            </form>
        </app-shared-ui-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SharedUiFormLayout, SharedUiFormErrors, NgIf, NgFor, RouterLink, FormsModule],
    providers: [provideLoginApi()],
})
export default class Login {
    protected readonly loginApi = injectLoginApi();

    protected loginUser: LoginUser = {
        email: '',
        password: '',
    };

    submit() {
        this.loginApi.login(this.loginUser);
    }
}
