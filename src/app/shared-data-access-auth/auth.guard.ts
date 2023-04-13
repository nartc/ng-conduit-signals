import { DestroyRef, effect, inject } from '@angular/core';
// import { toObservable } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { ReplaySubject, filter, map } from 'rxjs';
import { AuthService } from './auth.service';

export function authGuard(type: 'protected' | 'unprotected'): CanMatchFn {
    const sub = new ReplaySubject<boolean>(1);
    return () => {
        const router = inject(Router);
        const authService = inject(AuthService);
        const destroyRef = inject(DestroyRef);

        const watcher = effect(() => {
            sub.next(authService.isAuthenticated());
        });

        destroyRef.onDestroy(() => {
            sub.complete();
            watcher.destroy();
        });

        // until the build error is fixed, use this instead
        return sub.pipe(
            filter(() => !authService.isAuthenticating()),
            map((isAuthenticated) => {
                if ((type === 'unprotected' && !isAuthenticated) || (type === 'protected' && isAuthenticated))
                    return true;
                return router.parseUrl('/');
            })
        );
    };
}
