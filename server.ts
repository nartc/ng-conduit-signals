import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { ISRHandler } from 'ngx-isr/server';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { environment } from 'src/environments/environment';
import { RedisCacheHandler } from './redis-cache-handler';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/ng-conduit-signals/browser');
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

    const REDIS_CONNECTION_STRING = process.env['REDIS_CONNECTION_STRING'] || '';
    const INVALIDATE_TOKEN = process.env['INVALIDATE_TOKEN'] || '';

    const redisCacheHandler = REDIS_CONNECTION_STRING
        ? new RedisCacheHandler({ connectionString: REDIS_CONNECTION_STRING })
        : undefined;

    const isr = new ISRHandler({
        indexHtml,
        cache: redisCacheHandler,
        invalidateSecretToken: INVALIDATE_TOKEN,
        enableLogging: true,
        buildId: environment.buildId,
    });

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
    server.engine(
        'html',
        ngExpressEngine({
            bootstrap,
        })
    );

    server.set('view engine', 'html');
    server.set('views', distFolder);

    // Example Express Rest API endpoints
    // server.get('/api/**', (req, res) => { });
    // Serve static files from /browser
    server.get(
        '*.*',
        express.static(distFolder, {
            maxAge: '1y',
        })
    );

    server.get(
        '*',
        async (req, res, next) => await isr.serveFromCache(req, res, next),
        async (req, res, next) => await isr.render(req, res, next)
    );

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    run();
}

export * from './src/main.server';
