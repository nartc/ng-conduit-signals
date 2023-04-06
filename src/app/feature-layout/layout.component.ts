import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiLayoutFooter } from '../ui-layout/footer/footer.component';
import { UiLayoutHeader } from '../ui-layout/header/header.component';

@Component({
    standalone: true,
    template: `
        <app-ui-layout-header />
        <router-outlet />
        <app-ui-layout-footer />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiLayoutHeader, UiLayoutFooter, RouterOutlet],
})
export default class Layout {}
