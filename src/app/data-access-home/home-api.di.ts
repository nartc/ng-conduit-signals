import { ArticlesApiClient } from '../shared-data-access-api';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { FAVORITE_API, provideFavoriteApi } from './favorite-api.di';
import { homeApiFactory } from './home-api.factory';

export const [injectHomeApi, provideHomeApi] = createInjectionToken(homeApiFactory, {
    deps: [FAVORITE_API, ArticlesApiClient],
    isRoot: false,
    extraProviders: [provideFavoriteApi()],
});
