import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TagsApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

export function tagsApiFactory(tagsApiClient: TagsApiClient) {
    const status = signal<ApiStatus>('idle');
    const tags = signal<string[]>([]);

    const getTags = () => {
        status.set('loading');
        lastValueFrom(tagsApiClient.getTags())
            .then((response) => {
                status.set('success');
                tags.set(response.tags);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error('Error getting tags -->', error);
                status.set('error');
                tags.set([]);
            });
    };

    return {
        tags: () => tags(),
        status: () => status(),
        getTags,
    };
}

export type TagsApi = ReturnType<typeof tagsApiFactory>;
