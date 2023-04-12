import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-ui-profile-articles-toggle',
    template: `
        <ul class="nav nav-pills outline-active">
            <li class="nav-item">
                <a
                    class="nav-link"
                    [routerLink]="['/profile', username]"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                >
                    My Articles
                </a>
            </li>
            <li class="nav-item">
                <a
                    class="nav-link"
                    [routerLink]="['/profile', username, 'favorites']"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                >
                    Favorited Articles
                </a>
            </li>
        </ul>
    `,
    standalone: true,
    host: { class: 'block articles-toggle' },
    imports: [RouterLink, RouterLinkActive],
})
export class UiProfileArticlesToggle {
    @Input() username = '';
}
