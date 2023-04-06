import { inject } from '@angular/core';
import { fromSignal } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AUTH_API } from './auth-api.di';

export function nonAuthGuard(): CanMatchFn {
    return () => {
        const router = inject(Router);
        const authApi = inject(AUTH_API);

        return fromSignal(authApi.isAuthenticated).pipe(
            filter(() => !authApi.isAuthenticating()),
            map((isAuthenticated) => {
                if (!isAuthenticated) return true;
                return router.parseUrl('/');
            })
        );
    };
}
