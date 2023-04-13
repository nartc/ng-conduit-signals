import { inject } from '@angular/core';
// import { toObservable } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { filter, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export function authGuard(type: 'protected' | 'unprotected'): CanMatchFn {
    return () => {
        const router = inject(Router);
        const authService = inject(AuthService);

        // until the build error is fixed, use this instead 
        return of(authService.isAuthenticated()).pipe(
            filter(() => !authService.isAuthenticating()),
            map((isAuthenticated) => {
                if ((type === 'unprotected' && !isAuthenticated) || (type === 'protected' && isAuthenticated))
                    return true;
                return router.parseUrl('/');
            })
        );
    };
}
