import { FavoritesApiClient } from '../shared-data-access-api';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { favoriteApiFactory } from './favorite-api.factory';

export const [injectFavoriteApi, provideFavoriteApi, FAVORITE_API] = createInjectionToken(favoriteApiFactory, {
    deps: [FavoritesApiClient],
    isRoot: false,
});
