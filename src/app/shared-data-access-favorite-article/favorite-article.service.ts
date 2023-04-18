import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Article, FavoritesApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class FavoriteArticleService {
    readonly #favoritesApiClient = inject(FavoritesApiClient);
    readonly #status = signal<ApiStatus>('idle');

    readonly status = this.#status.asReadonly();

    toggleFavorite(article: Article) {
        this.#status.set('loading');
        return (
            article.favorited
                ? this.#favoritesApiClient.deleteArticleFavorite({ slug: article.slug })
                : this.#favoritesApiClient.createArticleFavorite({ slug: article.slug })
        )
            .then((response) => {
                this.#status.set('success');
                return response.article;
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error toggle favorite for ${article.slug}`, error);
                this.#status.set('error');
                return Promise.reject(error);
            });
    }
}
