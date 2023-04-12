import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Injectable, SecurityContext, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { lastValueFrom } from 'rxjs';
import { Article, ArticlesApiClient, Comment, CommentsApiClient, Profile } from '../shared-data-access-api';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { FollowAuthorService } from '../shared-data-access-follow-author/follow-author.service';
import { ApiStatus } from '../shared-data-access-models/api-status';

@Injectable()
export class ArticleService {
    readonly #router = inject(Router);
    readonly #domSanitizer = inject(DomSanitizer);
    readonly #articlesApiClient = inject(ArticlesApiClient);
    readonly #commentsApiClient = inject(CommentsApiClient);
    readonly #favoriteArticleService = inject(FavoriteArticleService);
    readonly #followAuthorService = inject(FollowAuthorService);
    readonly #authService = inject(AuthService);
    readonly #cdr = inject(ChangeDetectorRef);

    readonly #status = signal<ApiStatus>('idle');
    readonly #article = signal<Article | null>(null);
    readonly #comments = signal<Comment[]>([]);

    readonly isLoading = computed(() => this.#status() === 'loading');
    readonly article = computed(() => {
        const article = this.#article();
        if (!article) return article;
        return { ...article, body: this.#domSanitizer.sanitize(SecurityContext.HTML, marked(article.body)) as string };
    });
    readonly isOwner = computed(() => {
        const currentUser = this.#authService.user();
        const article = this.#article();
        return !!article && !!currentUser && article.author.username === currentUser.username;
    });
    readonly currentUserImage = computed(() => {
        const currentUser = this.#authService.user();
        return currentUser?.image || '';
    });
    readonly comments = computed(() => {
        const currentUser = this.#authService.user();
        const comments = this.#comments();
        const isOwner = this.isOwner();
        return comments.map((comment) => ({
            ...comment,
            isOwner:
                comment.author.username === currentUser?.username ||
                // if the current logged in user is the author, they should have the ability to delete comments
                // in other words, they are owners of all comments
                isOwner,
        }));
    });

    getArticle(slug: string) {
        this.#status.set('loading');
        Promise.all([
            lastValueFrom(this.#articlesApiClient.getArticle({ slug })),
            lastValueFrom(this.#commentsApiClient.getArticleComments({ slug })),
        ])
            .then(([articleResponse, commentsResponse]) => {
                this.#status.set('success');
                this.#article.set(articleResponse.article);
                this.#comments.set(commentsResponse.comments);
                // TODO not sure why we still need this?
                this.#cdr.markForCheck();
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error getting information for ${slug}`, error);
                this.#status.set('error');
                this.#article.set(null);
                this.#comments.set([]);
            });
    }

    toggleFavorite(articleToToggle: Article) {
        this.#favoriteArticleService.toggleFavorite(articleToToggle).then((response) => {
            if (response) {
                this.#article.set(response);
            }
        });
    }

    deleteArticle(slug: string) {
        lastValueFrom(this.#articlesApiClient.deleteArticle({ slug }))
            .then(() => {
                void this.#router.navigate(['/']);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error deleting article ${slug}`, error);
            });
    }

    toggleFollowAuthor(profile: Profile) {
        this.#followAuthorService
            .toggleFollow(profile)
            .then((response) => {
                if (response) {
                    this.#article.update((article) => ({ ...article!, author: response }));
                }
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error toggle follow for ${profile.username}`, error);
            });
    }

    createComment(comment: string) {
        const article = this.#article();
        if (article) {
            lastValueFrom(
                this.#commentsApiClient.createArticleComment({
                    body: { comment: { body: comment } },
                    slug: article.slug,
                })
            )
                .then((response) => {
                    this.#comments.update((comments) => [...comments, response.comment]);
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error(`Error creating new comment`, error);
                });
        }
    }

    deleteComment(id: number) {
        const article = this.#article();
        if (article) {
            lastValueFrom(this.#commentsApiClient.deleteArticleComment({ id, slug: article.slug }))
                .then(() => {
                    this.#comments.update((comments) => comments.filter((comment) => comment.id !== id));
                })
                .catch(({ error }: HttpErrorResponse) => {
                    console.error(`Error deleting comment`, error);
                });
        }
    }
}
