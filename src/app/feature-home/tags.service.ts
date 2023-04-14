import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TagsApiClient } from '../shared-data-access-api';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class TagsService {
    readonly #tagsApiClient = inject(TagsApiClient);

    readonly #status = signal<ApiStatus>('idle');
    readonly #tags = signal<string[]>([]);

    readonly tags = this.#tags.asReadonly();
    readonly status = this.#status.asReadonly();

    getTags() {
        this.#status.set('loading');
        lastValueFrom(this.#tagsApiClient.getTags())
            .then((response) => {
                this.#status.set('success');
                this.#tags.set(response.tags);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error('Error getting tags -->', error);
                this.#status.set('error');
                this.#tags.set([]);
            });
    }
}
