import { ArticlesApiClient } from '../shared-data-access-api';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { FAVORITE_API, provideFavoriteApi } from './favorite-api.di';
import { homeApiFactory } from './home-api.factory';
import { TAGS_API, provideTagsApi } from './tags-api.di';

export const [injectHomeApi, provideHomeApi] = createInjectionToken(homeApiFactory, {
    deps: [TAGS_API, FAVORITE_API, ArticlesApiClient],
    isRoot: false,
    extraProviders: [provideTagsApi(), provideFavoriteApi()],
});
