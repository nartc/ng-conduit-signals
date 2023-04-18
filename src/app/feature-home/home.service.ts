import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Article, ArticlesApiClient } from '../shared-data-access-api';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { ApiStatus } from '../shared-data-access-models/api-status';
import { FeedType } from '../shared-data-access-models/feed-type';

@Injectable()
export class HomeService {
    readonly #articlesApiClient = inject(ArticlesApiClient);
    readonly #favoriteArticleService = inject(FavoriteArticleService);

    readonly #status = signal<ApiStatus>('idle');
    readonly #feedType = signal<FeedType>('global');
    readonly #selectedTag = signal('');
    readonly #articles = signal<Article[]>([]);

    readonly articles = this.#articles.asReadonly();
    readonly status = this.#status.asReadonly();
    readonly feedType = this.#feedType.asReadonly();
    readonly selectedTag = this.#selectedTag.asReadonly();
    readonly toggleFavoriteStatus = this.#favoriteArticleService.status;

    getArticles(type: FeedType, tag?: string) {
        this.#status.set('loading');
        this.#feedType.set(type);
        this.#selectedTag.set(tag || '');

        const getArticlesPromise =
            type === 'feed'
                ? this.#articlesApiClient.getArticlesFeed.bind(this.#articlesApiClient)
                : type === 'tag' && tag
                ? this.#articlesApiClient.getArticles.bind(this.#articlesApiClient, { tag }, undefined) // undefined is HttpContext
                : this.#articlesApiClient.getArticles.bind(this.#articlesApiClient);

        getArticlesPromise()
            .then((response) => {
                this.#status.set('success');
                this.#articles.set(response.articles);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error getting articles for ${type}`, error);
                this.#status.set('error');
                this.#articles.set([]);
            });
    }

    toggleFavorite(articleToToggle: Article) {
        this.#favoriteArticleService
            .toggleFavorite(articleToToggle)
            .then((data) => {
                this.#articles.update((articles) =>
                    articles.map((article) => {
                        if (article.slug === data.slug) return data;
                        return article;
                    })
                );
            })
            .catch((error) => {
                // TODO handle error
            });
    }
}
