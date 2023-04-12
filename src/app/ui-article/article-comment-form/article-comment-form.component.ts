import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ui-article-article-comment-form',
    template: `
        <form #form="ngForm" class="card comment-form" (ngSubmit)="submit()">
            <div class="card-block">
                <textarea
                    class="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                    name="comment"
                    [(ngModel)]="newComment"
                    required
                ></textarea>
            </div>
            <div class="card-footer">
                <img [src]="currentUserImage" alt="Avatar of current user" class="comment-author-img" />
                <button type="submit" class="btn btn-sm btn-primary" [disabled]="form.invalid">Post Comment</button>
            </div>
        </form>
    `,
    standalone: true,
    imports: [FormsModule],
})
export class UiArticleArticleCommentForm {
    @Input() currentUserImage = '';
    @Output() comment = new EventEmitter<string>();

    newComment = '';

    submit() {
        this.comment.emit(this.newComment);
        this.newComment = '';
    }
}
