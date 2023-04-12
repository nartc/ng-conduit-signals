import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User, UserAndAuthenticationApiClient } from '../shared-data-access-api';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly userAndAuthenticationApiClient = inject(UserAndAuthenticationApiClient);
    private readonly router = inject(Router);

    private readonly user = signal<User | null>(null);
    private readonly status = signal<AuthStatus>('idle');

    readonly vm = {
        isAuthenticated: computed(() => this.status() === 'authenticated'),
        isAuthenticating: computed(() => this.status() === 'idle'),
        user: () => this.user(),
        username: () => this.user()?.username || '',
    };

    async refresh() {
        const token = localStorage.getItem('ng-conduit-signals-token');
        if (!token) {
            this.user.set(null);
            this.status.set('unauthenticated');
            return;
        }

        const currentUserResponse = await lastValueFrom(this.userAndAuthenticationApiClient.getCurrentUser()).catch(
            ({ error }: HttpErrorResponse) => {
                console.error(`error refreshing user -->`, error);
                this.user.set(null);
                return { user: null };
            }
        );

        this.user.set(currentUserResponse.user);
        this.status.set(currentUserResponse.user ? 'authenticated' : 'unauthenticated');
        localStorage.setItem('ng-conduit-signals-user', JSON.stringify(currentUserResponse.user));
    }

    authenticate(urlSegments: string[] = ['/']) {
        this.refresh().then(() => this.router.navigate(urlSegments));
    }
}
