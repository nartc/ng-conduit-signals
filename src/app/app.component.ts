import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectAuthApi } from './shared-data-access-auth/auth-api.di';

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
export class AppComponent implements OnInit {
    protected readonly authApi = injectAuthApi();

    ngOnInit() {
        this.authApi.refresh();
    }
}
