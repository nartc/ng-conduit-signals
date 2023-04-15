import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input as RouteInput, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FollowAuthorService } from '../shared-data-access-follow-author/follow-author.service';
import { UiProfileArticlesToggle } from '../ui-profile/articles-toggle/articles-toggle.component';
import { UiProfileUserInfo } from '../ui-profile/user-info/user-info.component';
import { ProfileService } from './profile.service';

@Component({
    template: `
        <ng-container *ngIf="!profileService.isLoading(); else loading">
            <ng-container *ngIf="profileService.profile() as profile">
                <app-ui-profile-user-info
                    [profile]="profile"
                    [isOwner]="profileService.isOwner()"
                    (toggleFollow)="profileService.toggleFollow(profile)"
                />
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-10 offset-md-1">
                            <app-ui-profile-articles-toggle [username]="profile.username" />
                            <router-outlet />
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <ng-template #loading>
            <p>Loading profile...</p>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: { class: 'block profile-page' },
    providers: [ProfileService, FollowAuthorService],
    imports: [NgIf, RouterOutlet, UiProfileUserInfo, UiProfileArticlesToggle],
})
export default class Profile {
    protected readonly profileService = inject(ProfileService);
    protected readonly titleService = inject(Title);

    @RouteInput() set username(username: string) {
        this.profileService.getProfile(username);
        this.titleService.setTitle(username + ' Author Profile');
    }
}
