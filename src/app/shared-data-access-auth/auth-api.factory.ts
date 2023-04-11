import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, filter, lastValueFrom, map, pipe, switchMap } from 'rxjs';
import { Profile, ProfileApiClient, User, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { computed$ } from '../shared-utils/pipeable-computed';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    status: AuthStatus;
}

export function authApiFactory(
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    profileApiClient: ProfileApiClient,
    router: Router
) {
    const user = signal<User | null>(null);
    const status = signal<AuthStatus>('idle');

    const isAuthenticating = computed(() => status() === 'idle');
    const isAuthenticated = computed(() => status() === 'authenticated');
    const username = computed(() => user()?.username || '');

    const refresh = async () => {
        const token = localStorage.getItem('ng-conduit-signals-token');
        if (!token) {
            user.set(null);
            status.set('unauthenticated');
            return;
        }

        const currentUserResponse = await lastValueFrom(userAndAuthenticationApiClient.getCurrentUser()).catch(
            ({ error }: HttpErrorResponse) => {
                console.error(`error refreshing user -->`, error);
                user.set(null);
                return { user: null };
            }
        );

        // profile fetching can actually go here instead.

        user.set(currentUserResponse?.user);
        status.set(currentUserResponse?.user ? 'authenticated' : 'unauthenticated');
        localStorage.setItem('ng-conduit-signals-user', JSON.stringify(currentUserResponse?.user));
    };

    const profile = computed$(
        username,
        pipe(
            filter((username) => !!username),
            switchMap((username) =>
                profileApiClient.getProfileByUsername({ username }).pipe(
                    map((response) => response.profile),
                    catchError(({ error }: HttpErrorResponse) => {
                        console.error(`error getting profile by username -->`, error);
                        return EMPTY;
                    })
                )
            )
        )
    );

    const authenticate = (urlSegments: string[] = ['/']) => {
        refresh().then(() => router.navigate(urlSegments));
    };

    return {
        isAuthenticated,
        isAuthenticating,
        username,
        profile,
        authenticate,
        refresh,
    };
}

export type AuthApi = ReturnType<typeof authApiFactory>;
