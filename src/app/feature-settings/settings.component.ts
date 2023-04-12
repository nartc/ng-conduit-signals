import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateUser } from '../shared-data-access-api';
import { SettingsService } from './settings.service';

@Component({
    standalone: true,
    template: `
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <form #form="ngForm" (ngSubmit)="settingsService.updateUser(updateUser)">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    [(ngModel)]="updateUser.image"
                                    class="form-control"
                                    type="text"
                                    placeholder="URL of profile picture"
                                    name="image"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Your Username"
                                    name="username"
                                    [(ngModel)]="updateUser.username"
                                    required
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="Short bio about you"
                                    name="bio"
                                    [(ngModel)]="updateUser.bio"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    [(ngModel)]="updateUser.email"
                                    required
                                    email
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    [(ngModel)]="updateUser.password"
                                />
                            </fieldset>
                            <button
                                type="submit"
                                class="btn btn-lg btn-primary pull-xs-right"
                                [disabled]="form.invalid || settingsService.vm.isLoading()"
                            >
                                Update Settings
                            </button>
                        </fieldset>
                    </form>

                    <hr />

                    <button class="btn btn-outline-danger" type="button" (click)="settingsService.logout()">
                        Or click here to logout.
                    </button>
                </div>
            </div>
        </div>
    `,
    imports: [ReactiveFormsModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SettingsService],
    host: { class: 'block settings-page' },
})
export default class Settings {
    protected readonly settingsService = inject(SettingsService);
    protected updateUser: UpdateUser = {};

    constructor() {
        effect(() => {
            const user = this.settingsService.vm.user();
            if (user) {
                this.updateUser = structuredClone(user);
                this.updateUser.password = '';
            }
        });
    }
}
