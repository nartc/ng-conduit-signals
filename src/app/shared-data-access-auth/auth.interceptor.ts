import { HttpInterceptorFn } from '@angular/common/http';
import { injectIsServer } from '../shared-utils/is-server';

export function authInterceptor(): HttpInterceptorFn {
    return (req, next) => {
        const isServer = injectIsServer();

        const token = isServer ? null : localStorage.getItem('ng-conduit-signals-token');

        if (token) {
            req = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
        }

        return next(req);
    };
}
