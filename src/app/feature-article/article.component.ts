import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input as RouteInput, inject } from '@angular/core';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { FollowAuthorService } from '../shared-data-access-follow-author/follow-author.service';
import { UiArticleArticleCommentForm } from '../ui-article/article-comment-form/article-comment-form.component';
import { UiArticleArticleComment } from '../ui-article/article-comment/article-comment.component';
import { UiArticleArticleMeta } from '../ui-article/article-meta/article-meta.component';
import { ArticleService } from './article.service';

@Component({
    standalone: true,
    template: `
        <ng-container *ngIf="!articleService.isLoading(); else loading">
            <ng-container *ngIf="articleService.article() as article">
                <div class="banner">
                    <div class="container">
                        <h1>{{ article.title }}</h1>

                        <app-ui-article-article-meta
                            [article]="article"
                            [isOwner]="articleService.isOwner()"
                            (toggleFavorite)="articleService.toggleFavorite(article)"
                            (delete)="articleService.deleteArticle(article.slug)"
                            (followAuthor)="articleService.toggleFollowAuthor($event)"
                        />
                    </div>
                </div>

                <div class="container page">
                    <div class="row article-content">
                        <div class="col-md-12">
                            <div class="body" [innerHTML]="article.body"></div>
                            <ul *ngIf="article.tagList.length > 0" class="tag-list">
                                <li
                                    class="tag-default tag-pill tag-outline ng-binding ng-scope"
                                    *ngFor="let tag of article.tagList"
                                >
                                    {{ tag }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr />

                    <div class="article-actions">
                        <app-ui-article-article-meta
                            [article]="article"
                            [isOwner]="articleService.isOwner()"
                            (toggleFavorite)="articleService.toggleFavorite(article)"
                            (delete)="articleService.deleteArticle(article.slug)"
                            (followAuthor)="articleService.toggleFollowAuthor($event)"
                        />
                    </div>

                    <div class="row">
                        <div class="col-xs-12 col-md-8 offset-md-2">
                            <app-ui-article-article-comment-form
                                [currentUserImage]="articleService.currentUserImage()"
                                (comment)="articleService.createComment($event)"
                            />

                            <app-ui-article-article-comment
                                *ngFor="let comment of articleService.comments()"
                                [comment]="comment"
                                (delete)="articleService.deleteComment(comment.id)"
                            />
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <ng-template #loading>
            <p>Loading article...</p>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ArticleService, FollowAuthorService, FavoriteArticleService],
    host: { class: 'block article-page' },
    imports: [UiArticleArticleMeta, UiArticleArticleCommentForm, UiArticleArticleComment, NgIf, NgFor],
})
export default class Article {
    protected readonly articleService = inject(ArticleService);

    @RouteInput() set slug(slug: string) {
        this.articleService.getArticle(slug);
    }
}
