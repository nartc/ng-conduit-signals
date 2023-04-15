import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, computed, inject, Injectable, signal } from '@angular/core';
import { Profile, ProfileApiClient } from '../shared-data-access-api';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FollowAuthorService } from '../shared-data-access-follow-author/follow-author.service';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class ProfileService {
    readonly #profileApiClient = inject(ProfileApiClient);
    readonly #authService = inject(AuthService);
    readonly #followAuthorService = inject(FollowAuthorService);
    readonly #cdr = inject(ChangeDetectorRef);

    readonly #status = signal<ApiStatus>('idle');
    readonly #profile = signal<Profile | null>(null);

    readonly profile = this.#profile.asReadonly();
    readonly isLoading = computed(() => this.#status() === 'loading');
    readonly isOwner = computed(() => {
        const currentUser = this.#authService.user();
        const profile = this.profile();
        return !!currentUser && !!profile && profile.username === currentUser.username;
    });

    getProfile(username: string) {
        this.#status.set('loading');
        this.#profileApiClient
            .getProfileByUsername({ username })
            .then((response) => {
                this.#status.set('success');
                this.#profile.set(response.profile);
                // TODO why do we need this?
                this.#cdr.markForCheck();
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error('error getting profile by username: ', error);
                this.#status.set('error');
                this.#profile.set(null);
            });
    }

    toggleFollow(profile: Profile) {
        this.#followAuthorService.toggleFollow(profile).then((response) => {
            if (response) {
                this.#profile.set(response);
            }
        });
    }
}
