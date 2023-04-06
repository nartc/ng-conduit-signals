import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, computed, signal } from '@angular/core';
import { fromSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { defer, filter, of, switchMap, tap } from 'rxjs';
import { Profile, ProfileApiClient, User, UserAndAuthenticationApiClient } from '../shared-data-access-api';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    status: AuthStatus;
}

export function authApiFactory(
    userAndAuthenticationApiClient: UserAndAuthenticationApiClient,
    profileApiClient: ProfileApiClient,
    router: Router,
    destroyRef: DestroyRef
) {
    const user = signal<User | null>(null);
    const profile = signal<Profile | null>(null);
    const status = signal<AuthStatus>('idle');

    const isAuthenticating = computed(() => status() === 'idle');
    const isAuthenticated = computed(() => status() === 'authenticated');
    const username = computed(() => user()?.username);

    const refresh$ = defer(() => {
        const token = localStorage.getItem('ng-conduit-signals-token');
        if (!token) return of(null);
        return userAndAuthenticationApiClient.getCurrentUser();
    }).pipe(
        tap({
            next: (response) => {
                user.set(response?.user || null);
                status.set(response?.user ? 'authenticated' : 'unauthenticated');
                localStorage.setItem('ng-conduit-signals-user', JSON.stringify(response?.user));
            },
            error: ({ error }: HttpErrorResponse) => {
                console.error(`error refreshing user -->`, error);
                user.set(null);
            },
        })
    );

    const getProfile$ = fromSignal(username).pipe(
        filter((username): username is string => !!username),
        switchMap((username) =>
            profileApiClient.getProfileByUsername({ username }).pipe(
                tap({
                    next: (response) => {
                        profile.set(response.profile);
                    },
                    error: ({ error }: HttpErrorResponse) => {
                        console.error(`error getting profile by username -->`, error);
                    },
                })
            )
        )
    );

    const init = () => {
        refresh$.pipe(takeUntilDestroyed(destroyRef)).subscribe();
        getProfile$.pipe(takeUntilDestroyed(destroyRef)).subscribe();
    };

    const authenticate = (urlSegments: string[] = ['/']) => {
        refresh$.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
            void router.navigate(urlSegments);
        });
    };

    return {
        isAuthenticated,
        isAuthenticating,
        username,
        init,
        authenticate,
    };
}

export type AuthApi = ReturnType<typeof authApiFactory>;
