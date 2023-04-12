import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Article, ArticlesApiClient, Comment, CommentsApiClient } from '../shared-data-access-api';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { FollowAuthorService } from '../shared-data-access-follow-author/follow-author.service';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class ArticleService {
    private readonly router = inject(Router);
    private readonly articlesApiClient = inject(ArticlesApiClient);
    private readonly commentsApiClient = inject(CommentsApiClient);
    private readonly favoriteArticleService = inject(FavoriteArticleService);
    private readonly followAuthorService = inject(FollowAuthorService);
    private readonly authService = inject(AuthService);

    private readonly status = signal<ApiStatus>('idle');
    private readonly article = signal<Article | null>(null);
    private readonly comments = signal<Comment[]>([]);

    readonly vm = {
        article: computed(() => {
            const article = this.article();
            if (!article) return article;

            const toggledFavorite = this.favoriteArticleService.vm.toggledFavorite();
            if (toggledFavorite) {
            }
        }),
    };

    getArticle(slug: string) {
        this.status.set('loading');
        Promise.all([
            lastValueFrom(this.articlesApiClient.getArticle({ slug })),
            lastValueFrom(this.commentsApiClient.getArticleComments({ slug })),
        ])
            .then(([articleResponse, commentsResponse]) => {
                this.status.set('success');
                this.article.set(articleResponse.article);
                this.comments.set(commentsResponse.comments);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error getting information for ${slug}`, error);
                this.status.set('error');
                this.article.set(null);
                this.comments.set([]);
            });
    }
}
