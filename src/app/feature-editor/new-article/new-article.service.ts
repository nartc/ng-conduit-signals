import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared-data-access-auth/auth.service';
import { ArticlesApiClient, NewArticle } from '../../shared-data-access-api';

@Injectable()
export class NewArticleService {
    readonly #articlesClient = inject(ArticlesApiClient);
    readonly #router = inject(Router);
    readonly #authService = inject(AuthService);

    createArticle(newArticle: NewArticle) {
        const currentUser = this.#authService.user();
        if (currentUser) {
            this.#articlesClient
                .createArticle({ body: { article: newArticle } })
                .then((response) => {
                    if (response) {
                        this.#router.navigate(['/article', response.article.slug]);
                    } else {
                        this.#router.navigate(['/profile', currentUser.username]);
                    }
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error(`Error creating article `, error);
                });
        }
    }
}
