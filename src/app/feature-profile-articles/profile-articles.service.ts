import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProfileService } from '../feature-profile/profile.service';
import { Article, ArticlesApiClient } from '../shared-data-access-api';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { ApiStatus } from '../shared-data-access-models/api-status';
import { PROFILE_ARTICLES_TYPE } from './profile-articles.di';

@Injectable()
export class ProfileArticlesService {
    readonly #articlesApiClient = inject(ArticlesApiClient);
    readonly #favoriteArticleService = inject(FavoriteArticleService);

    readonly #articlesType = inject(PROFILE_ARTICLES_TYPE);
    readonly #profileService = inject(ProfileService);

    readonly #status = signal<ApiStatus>('idle');
    readonly #articles = signal<Article[]>([]);

    readonly status = this.#status.asReadonly();
    readonly articles = this.#articles.asReadonly();

    getArticles() {
        const profile = this.#profileService.profile();
        if (profile) {
            this.#status.set('loading');
            (this.#articlesType === 'favorites'
                ? this.#articlesApiClient.getArticles({ favorited: profile.username })
                : this.#articlesApiClient.getArticles({ author: profile.username })
            )
                .then((response) => {
                    this.#status.set('success');
                    this.#articles.set(response.articles);
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error('error getting articles: ', error);
                    this.#status.set('error');
                    this.#articles.set([]);
                });
        }
    }

    toggleFavorite(articleToToggle: Article) {
        this.#favoriteArticleService
            .toggleFavorite(articleToToggle)
            .then((response) => {
                this.#articles.update((articles) =>
                    articles.map((article) => {
                        if (article.slug === articleToToggle.slug) return response;
                        return article;
                    })
                );
            })
            .catch((error) => {
                // TODO handle error
            });
    }
}
