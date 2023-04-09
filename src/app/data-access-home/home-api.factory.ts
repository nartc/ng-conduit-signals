import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { fromObservable, fromSignal } from '@angular/core/rxjs-interop';
import { catchError, defer, map, of, switchMap } from 'rxjs';
import { ArticlesApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';
import { FeedType } from '../shared-data-access-models/feed-type';
import { FavoriteApi } from './favorite-api.factory';
import { TagsApi } from './tags-api.factory';

export function homeApiFactory(tagsApi: TagsApi, favoriteApi: FavoriteApi, articlesApiClient: ArticlesApiClient) {
    const status = signal<ApiStatus>('loading');
    const feedType = signal<FeedType>('global');

    const articles = fromObservable(
        fromSignal(feedType).pipe(
            // tap(() => status() !== 'loading' && status.set('loading')),
            switchMap((type) =>
                defer(() => {
                    if (type === 'feed') return articlesApiClient.getArticlesFeed();
                    if (type === 'tag' && tagsApi.selectedTag()) {
                        // TODO so nested fromSignal is a no-no
                        // return fromSignal(tagsApi.selectedTag).pipe(
                        // switchMap((selectedTag) => articlesApiClient.getArticles({ tag: selectedTag }))
                        // );
                        return articlesApiClient.getArticles({ tag: tagsApi.selectedTag() });
                    }
                    return articlesApiClient.getArticles();
                }).pipe(
                    map((response) => {
                        // status.set('success');
                        return response.articles;
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        console.error(`Error getting articles -->`, error);
                        return of([]);
                    })
                )
            )
            // TODO why do we need this?
            // - If we shouldn't do this, what should we do
            // if we want to have loading state toggled between Data Fetch stages?
            // observeOn(asapScheduler)
        ),
        []
    );

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
        setFeedType: (data: FeedType) => feedType.set(data),
    };
}

export type HomeApi = ReturnType<typeof homeApiFactory>;
