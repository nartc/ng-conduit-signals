import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedUiArticleForm } from '../../shared-ui/article-form/article-form.component';
import { SharedUiFormLayout } from '../../shared-ui/form-layout/form-layout.component';
import { NewArticleService } from './new-article.service';

@Component({
    template: `
        <app-shared-ui-form-layout class="editor-page" innerClass="col-md-10 offset-md-1 col-xs-12">
            <app-shared-ui-article-form (articleSubmit)="newArticleService.createArticle($event)" />
        </app-shared-ui-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedUiFormLayout, SharedUiArticleForm],
    providers: [NewArticleService],
})
export default class NewArticle {
    protected readonly newArticleService = inject(NewArticleService);
}
