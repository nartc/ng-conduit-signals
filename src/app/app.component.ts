import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared-data-access-auth/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgIf],
    template: `
        <ng-container *ngIf="authService.vm.isAuthenticating(); else done">Loading...</ng-container>
        <ng-template #done>
            <router-outlet />
        </ng-template>
    `,
})
export class AppComponent implements OnInit {
    protected readonly authService = inject(AuthService);

    ngOnInit() {
        this.authService.refresh();
    }
}
