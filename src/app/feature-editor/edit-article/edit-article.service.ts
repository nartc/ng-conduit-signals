import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Article, ArticlesApiClient, UpdateArticle } from '../../shared-data-access-api';
import { ApiStatus } from '../../shared-data-access-models/api-status';

@Injectable()
export class EditArticleService {
    readonly #articlesApiClient = inject(ArticlesApiClient);
    readonly #router = inject(Router);

    readonly #status = signal<ApiStatus>('idle');
    readonly #article = signal<Article | null>(null);

    readonly isLoading = computed(() => this.#status() === 'loading');
    readonly article = () => this.#article();

    getArticle(slug: string) {
        this.#status.set('loading');
        lastValueFrom(this.#articlesApiClient.getArticle({ slug }))
            .then((response) => {
                this.#status.set('success');
                this.#article.set(response.article);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error('error getting article by slug: ', error);
                this.#status.set('error');
            });
    }

    updateArticle(articleToUpdate: UpdateArticle) {
        const article = this.#article();
        if (article) {
            lastValueFrom(
                this.#articlesApiClient.updateArticle({ slug: article.slug, body: { article: articleToUpdate } })
            )
                .then((response) => {
                    void this.#router.navigate(['/article', response.article.slug]);
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error('error updating article: ', error);
                });
        }
    }
}
