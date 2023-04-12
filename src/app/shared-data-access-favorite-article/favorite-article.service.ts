import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Article, FavoritesApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class FavoriteArticleService {
    private readonly favoritesApiClient = inject(FavoritesApiClient);

    private readonly status = signal<ApiStatus>('idle');
    private readonly toggledFavorite = signal<Article | null>(null);

    readonly vm = {
        status: () => this.status(),
        toggledFavorite: () => this.toggledFavorite(),
    };

    toggleFavorite(article: Article) {
        this.status.set('loading');
        lastValueFrom(
            article.favorited
                ? this.favoritesApiClient.deleteArticleFavorite({ slug: article.slug })
                : this.favoritesApiClient.createArticleFavorite({ slug: article.slug })
        )
            .then((response) => {
                this.status.set('success');
                this.toggledFavorite.set(response.article);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error toggle favorite for ${article.slug}`, error);
                this.status.set('error');
                this.toggledFavorite.set(null);
            });
    }
}
