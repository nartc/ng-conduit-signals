import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectAuthApi } from '../shared-data-access-auth/auth-api.di';
import { UiLayoutFooter } from '../ui-layout/footer/footer.component';
import { UiLayoutHeader } from '../ui-layout/header/header.component';

@Component({
    standalone: true,
    template: `
        <app-ui-layout-header [username]="authApi.username()" [isAuthenticated]="authApi.isAuthenticated()" />
        <router-outlet />
        <app-ui-layout-footer />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiLayoutHeader, UiLayoutFooter, RouterOutlet],
})
export default class Layout {
    protected readonly authApi = injectAuthApi();
}
