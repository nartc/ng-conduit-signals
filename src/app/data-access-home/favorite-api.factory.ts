import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { fromObservable, fromSignal } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, defer, exhaustMap, filter, map, tap } from 'rxjs';
import { Article, FavoritesApiClient } from '../shared-data-access-api';

export function favoriteApiFactory(favoritesApiClient: FavoritesApiClient) {
    const article = signal<Article | null>(null);
    const toggledFavorite = fromObservable(
        fromSignal(article).pipe(
            filter((v): v is Article => !!v),
            exhaustMap(({ favorited, slug }) =>
                defer(() => {
                    if (favorited) return favoritesApiClient.deleteArticleFavorite({ slug });
                    return favoritesApiClient.createArticleFavorite({ slug });
                }).pipe(
                    map((response) => response.article),
                    tap({
                        finalize: () => {
                            // TODO this is a bit dangerous.
                            // We want to reset the signal to null after we _attempt_ to toggle it
                            // but this Signal is a trigger for fromSignal.
                            // However, we have a "filter" so it's _fine_ (I think)
                            article.set(null);
                        },
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        console.error(`Error toggle favorite for ${slug}`, error);
                        return EMPTY;
                    })
                )
            )
        ),
        article()
    );

    return { toggledFavorite, toggle: (data: Article) => article.set(data) };
}

export type FavoriteApi = ReturnType<typeof favoriteApiFactory>;
