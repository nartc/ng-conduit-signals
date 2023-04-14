import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared-data-access-auth/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <router-outlet />
    `,
})
export class AppComponent implements OnInit {
    protected readonly authService = inject(AuthService);

    ngOnInit() {
        this.authService.refresh();
    }
}
