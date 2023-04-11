import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Article, FavoritesApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

export function favoriteApiFactory(favoritesApiClient: FavoritesApiClient) {
    const status = signal<ApiStatus>('idle');
    const toggledFavorite = signal<Article | null>(null);

    return {
        status: () => status(),
        toggledFavorite: () => toggledFavorite(),
        toggleFavorite: (data: Article) => {
            status.set('loading');
            lastValueFrom(
                data.favorited
                    ? favoritesApiClient.deleteArticleFavorite({ slug: data.slug })
                    : favoritesApiClient.createArticleFavorite({ slug: data.slug })
            )
                .then((response) => {
                    status.set('success');
                    toggledFavorite.set(response.article);
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error(`Error toggle favorite for ${data.slug}`, error);
                    status.set('error');
                    toggledFavorite.set(null);
                });
        },
    };
}

export type FavoriteApi = ReturnType<typeof favoriteApiFactory>;
