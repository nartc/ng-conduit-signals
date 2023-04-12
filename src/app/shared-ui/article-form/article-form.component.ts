import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Article } from '../../shared-data-access-api';

export interface ArticleFormData {
    title: string;
    body: string;
    description: string;
    tagList: string[];
}

@Component({
    selector: 'app-shared-ui-article-form',
    template: `
        <form #form="ngForm">
            <fieldset>
                <fieldset class="form-group">
                    <input
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Article Title"
                        name="title"
                        [(ngModel)]="articleFormData.title"
                    />
                </fieldset>
                <fieldset class="form-group">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="What's this article about?"
                        name="description"
                        [(ngModel)]="articleFormData.description"
                    />
                </fieldset>
                <fieldset class="form-group">
                    <textarea
                        class="form-control"
                        rows="8"
                        placeholder="Write your article (in markdown)"
                        name="body"
                        [(ngModel)]="articleFormData.body"
                    ></textarea>
                </fieldset>
                <fieldset class="form-group">
                    <input
                        #tagInput
                        type="text"
                        class="form-control"
                        placeholder="Enter tags"
                        (keydown.enter)="addTag(tagInput)"
                    />
                    <div class="tag-list" *ngIf="articleFormData.tagList?.length">
                        <span class="tag-pill tag-default" *ngFor="let tag of articleFormData.tagList">
                            <i class="ion-close-round" (click)="removeTag(tag)"></i>
                            {{ ' ' + tag }}
                        </span>
                    </div>
                </fieldset>
                <button
                    class="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    [disabled]="form.invalid"
                    (click)="articleSubmit.emit(articleFormData)"
                >
                    Publish Article
                </button>
            </fieldset>
        </form>
    `,
    standalone: true,
    imports: [NgIf, NgFor, FormsModule],
})
export class SharedUiArticleForm {
    @Input() set article(article: Article) {
        // set initial form value
        this.articleFormData = {
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
        };
    }

    @Output() articleSubmit = new EventEmitter<ArticleFormData>();

    protected articleFormData: ArticleFormData = {
        title: '',
        description: '',
        body: '',
        tagList: [],
    };

    addTag(tagInput: HTMLInputElement) {
        const trimmed = tagInput.value?.trim();

        if (!trimmed) return;

        this.articleFormData.tagList = [...this.articleFormData.tagList, trimmed];

        tagInput.value = '';
    }

    removeTag(tagToRemove: string) {
        this.articleFormData.tagList = this.articleFormData.tagList.filter((tag) => tag !== tagToRemove);
    }
}
