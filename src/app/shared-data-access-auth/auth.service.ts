import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User, UserAndAuthenticationApiClient } from '../shared-data-access-api';
import { injectIsServer } from '../shared-utils/is-server';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
    readonly #userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
    readonly #router = inject(Router);
    readonly #isServer = injectIsServer();

    readonly #user = signal<User | null>(null);
    readonly #status = signal<AuthStatus>('idle');

    readonly isAuthenticated = computed(() => this.#status() === 'authenticated');
    readonly isAuthenticating = computed(() => this.#status() === 'idle');
    readonly user = this.#user.asReadonly();
    readonly username = computed(() => this.#user()?.username || '');

    async refresh() {
        if (this.#isServer) return;

        const token = localStorage.getItem('ng-conduit-signals-token');
        if (!token) {
            this.#user.set(null);
            this.#status.set('unauthenticated');
            return;
        }

        const currentUserResponse = await lastValueFrom(this.#userAndAuthenticationApiClient.getCurrentUser()).catch(
            ({ error }: HttpErrorResponse) => {
                console.error(`error refreshing user -->`, error);
                this.#user.set(null);
                return { user: null };
            }
        );

        this.#user.set(currentUserResponse.user);
        this.#status.set(currentUserResponse.user ? 'authenticated' : 'unauthenticated');
        localStorage.setItem('ng-conduit-signals-user', JSON.stringify(currentUserResponse.user));
    }

    authenticate(urlSegments: string[] = ['/']) {
        this.refresh().then(() => this.#router.navigate(urlSegments));
    }
}
