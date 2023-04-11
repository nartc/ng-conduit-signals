import { inject } from '@angular/core';
import { fromSignal } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { injectAuthApi } from './auth-api.di';

export function authGuard(type: 'protected' | 'unprotected'): CanMatchFn {
    return () => {
        const router = inject(Router);
        const authApi = injectAuthApi();

        return fromSignal(authApi.isAuthenticated).pipe(
            filter(() => !authApi.isAuthenticating()),
            map((isAuthenticated) => {
                if ((type === 'unprotected' && !isAuthenticated) || (type === 'protected' && isAuthenticated))
                    return true;
                return router.parseUrl('/');
            })
        );
    };
}
