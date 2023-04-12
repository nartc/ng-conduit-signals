import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommentWithOwner } from '../../shared-data-access-models/comment-with-owner';

@Component({
    selector: 'app-ui-article-article-comment[comment]',
    template: `
        <div class="card-block">
            <p class="card-text">
                {{ comment.body }}
            </p>
        </div>
        <div class="card-footer">
            <a [routerLink]="['/profile', comment.author.username]" class="comment-author" id="authorAvatar">
                <img [src]="comment.author.image" class="comment-author-img" alt="Avatar of comment author" />
            </a>
            &nbsp;
            <a [routerLink]="['/profile', comment.author.username]" class="comment-author" id="authorUsername">
                {{ comment.author.username }}
            </a>
            <span class="date-posted">
                {{ comment.updatedAt | date : 'mediumDate' }}
            </span>
            <span class="mod-options" *ngIf="comment.isOwner">
                <i class="ion-trash-a" (click)="delete.emit()"></i>
            </span>
        </div>
    `,
    host: { class: 'block card' },
    standalone: true,
    imports: [RouterLink, NgIf, DatePipe],
})
export class UiArticleArticleComment {
    @Input() comment!: CommentWithOwner;
    @Output() delete = new EventEmitter();
}
