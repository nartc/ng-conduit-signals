import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { fromObservable } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { TagsApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

export function tagsApiFactory(tagsApiClient: TagsApiClient) {
    const status = signal<ApiStatus>('loading');
    const selectedTag = signal('');
    const tags = fromObservable(
        tagsApiClient.getTags().pipe(
            map((response) => {
                status.set('success');
                return response.tags;
            }),
            catchError(({ error }: HttpErrorResponse) => {
                console.error('Error getting tags -->', error);
                status.set('error');
                return of([]);
            })
        ),
        []
    );

    return {
        tags,
        status: () => status(),
        selectTag: (tag: string) => selectedTag.set(tag),
        selectedTag: computed(() => selectedTag()),
    };
}

export type TagsApi = ReturnType<typeof tagsApiFactory>;
