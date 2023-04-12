import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Profile, ProfileApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class FollowAuthorService {
    readonly #profileApiClient = inject(ProfileApiClient);

    readonly #status = signal<ApiStatus>('idle');

    readonly status = () => this.#status();

    toggleFollow(profile: Profile) {
        this.#status.set('loading');
        return lastValueFrom(
            profile.following
                ? this.#profileApiClient.unfollowUserByUsername({ username: profile.username })
                : this.#profileApiClient.followUserByUsername({ username: profile.username })
        )
            .then((response) => {
                this.#status.set('success');
                return response.profile;
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error toggling follow for ${profile.username}`, error);
                this.#status.set('error');
                return null;
            });
    }
}
