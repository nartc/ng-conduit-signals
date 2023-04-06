import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AUTH_API } from './shared-data-access-auth/auth-api.di';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgIf],
    template: `
        <ng-container *ngIf="authApi.isAuthenticating(); else done">Loading...</ng-container>
        <ng-template #done>
            <router-outlet />
        </ng-template>
    `,
})
export class AppComponent {
    protected readonly authApi = inject(AUTH_API);

    ngOnInit() {
        this.authApi.init();
    }
}
