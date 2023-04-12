import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Profile, ProfileApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class FollowAuthorService {
    private readonly profileApiClient = inject(ProfileApiClient);

    private readonly status = signal<ApiStatus>('idle');
    private readonly toggledAuthor = signal<Profile | null>(null);

    readonly vm = {
        status: () => this.status(),
        toggledAuthor: () => this.toggledAuthor(),
    };

    toggleFollow(profile: Profile) {
        this.status.set('loading');
        lastValueFrom(
            profile.following
                ? this.profileApiClient.unfollowUserByUsername({ username: profile.username })
                : this.profileApiClient.followUserByUsername({ username: profile.username })
        )
            .then((response) => {
                this.status.set('success');
                this.toggledAuthor.set(response.profile);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error toggling follow for ${profile.username}`, error);
                this.status.set('error');
                this.toggledAuthor.set(null);
            });
    }
}
