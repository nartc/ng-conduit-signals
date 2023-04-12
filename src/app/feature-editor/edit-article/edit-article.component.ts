import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input as RouteInput, inject } from '@angular/core';
import { SharedUiArticleForm } from '../../shared-ui/article-form/article-form.component';
import { SharedUiFormLayout } from '../../shared-ui/form-layout/form-layout.component';
import { EditArticleService } from './edit-article.service';

@Component({
    template: `
        <app-shared-ui-form-layout class="editor-page" innerClass="col-md-10 offset-md-1 col-xs-12">
            <app-shared-ui-article-form
                *ngIf="article"
                [article]="article"
                (articleSubmit)="editArticleService.updateArticle($event)"
            />
        </app-shared-ui-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [EditArticleService],
    imports: [NgIf, SharedUiFormLayout, SharedUiArticleForm],
})
export default class EditArticle {
    protected readonly editArticleService = inject(EditArticleService);

    @RouteInput() set slug(slug: string) {
        this.editArticleService.getArticle(slug);
    }

    get article() {
        return this.editArticleService.article()!;
    }
}
