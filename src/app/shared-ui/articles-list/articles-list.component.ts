import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../shared-data-access-api';
import { ApiStatus } from '../../shared-data-access-models/api-status';
import { SharedUiArticlePreview } from '../article-preview/article-preview.component';

@Component({
    selector: 'app-shared-ui-articles-list[status]',
    template: `
        <ng-container *ngIf="status !== 'loading'; else loading">
            <ng-container *ngIf="articles.length > 0; else noArticles">
                <app-shared-ui-article-preview
                    *ngFor="let article of articles"
                    [article]="article"
                    (toggleFavorite)="toggleFavorite.emit($event)"
                />
            </ng-container>
            <ng-template #noArticles>
                <app-shared-ui-article-preview>No articles are here...yet</app-shared-ui-article-preview>
            </ng-template>
        </ng-container>

        <ng-template #loading>
            <app-shared-ui-article-preview>Loading articles...</app-shared-ui-article-preview>
        </ng-template>
    `,
    standalone: true,
    imports: [SharedUiArticlePreview, NgIf, NgFor],
})
export class SharedUiArticlesList {
    @Input() status!: ApiStatus;
    @Input() articles: Article[] = [];
    @Output() toggleFavorite = new EventEmitter<Article>();
}
