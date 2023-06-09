import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Profile } from '../../shared-data-access-api';

@Component({
    selector: 'app-ui-profile-user-info[profile]',
    template: `
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <img [src]="profile.image" alt="Avatar of profile" class="user-img" />
                    <h4>{{ profile.username }}</h4>
                    <p>
                        {{ profile.bio }}
                    </p>
                    <a
                        *ngIf="isOwner; else nonOwner"
                        class="btn btn-sm btn-outline-secondary action-btn"
                        routerLink="/settings"
                    >
                        <i class="ion-gear-a"></i>
                        Edit profile Settings
                    </a>
                    <ng-template #nonOwner>
                        <button class="btn btn-sm btn-outline-secondary action-btn" (click)="toggleFollow.emit()">
                            <i class="ion-plus-round"></i>
                            &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }}
                            {{ profile.username }}
                        </button>
                    </ng-template>
                </div>
            </div>
        </div>
    `,
    host: { class: 'block user-info' },
    standalone: true,
    imports: [NgIf, RouterLink, RouterLinkActive],
})
export class UiProfileUserInfo {
    @Input() profile!: Profile;
    @Input() isOwner = false;
    @Output() toggleFollow = new EventEmitter();
}
