import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { defer, lastValueFrom } from 'rxjs';
import { Article, ArticlesApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';
import { FeedType } from '../shared-data-access-models/feed-type';
import { FavoriteApi } from './favorite-api.factory';

export function homeApiFactory(favoriteApi: FavoriteApi, articlesApiClient: ArticlesApiClient) {
    const status = signal<ApiStatus>('idle');
    const feedType = signal<FeedType>('global');
    const selectedTag = signal('');
    const articles = signal<Article[]>([]);

    const getArticles = (type: FeedType, tag?: string) => {
        status.set('loading');
        feedType.set(type);

        if (tag) {
            selectedTag.set(tag);
        } else {
            selectedTag.set('');
        }

        lastValueFrom(
            defer(() => {
                if (type === 'feed') return articlesApiClient.getArticlesFeed();
                if (type === 'tag' && tag) {
                    return articlesApiClient.getArticles({ tag });
                }
                return articlesApiClient.getArticles();
            })
        )
            .then((response) => {
                status.set('success');
                articles.set(response.articles);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error getting articles -->`, error);
                status.set('error');
                articles.set([]);
            });
    };

    return {
        articles: computed(() => {
            const originalArticles = articles();
            const toggledFavorite = favoriteApi.toggledFavorite();
            if (toggledFavorite) {
                return originalArticles.map((article) => {
                    if (article.slug === toggledFavorite.slug) return toggledFavorite;
                    return article;
                });
            }
            return originalArticles;
        }),
        status: () => status(),
        feedType: () => feedType(),
        selectedTag: () => selectedTag(),
        getArticles,
    };
}

export type HomeApi = ReturnType<typeof homeApiFactory>;
