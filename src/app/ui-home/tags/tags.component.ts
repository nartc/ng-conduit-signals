import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ApiStatus } from '../../shared-data-access-models/api-status';

@Component({
    selector: 'app-ui-home-tags',
    standalone: true,
    template: `
        <p>Popular Tags</p>

        <div class="tag-list">
            <ng-container *ngIf="status !== 'loading'; else loading">
                <ng-container *ngIf="tags.length; else noTags">
                    <a class="tag-pill tag-default" *ngFor="let tag of tags" (click)="selectTag.emit(tag)">
                        {{ tag }}
                    </a>
                </ng-container>
                <ng-template #noTags>No tags</ng-template>
            </ng-container>
        </div>

        <ng-template #loading>
            <ng-content />
        </ng-template>
    `,
    host: { class: 'block sidebar' },
    imports: [NgIf, NgFor],
})
export class UiHomeTags {
    @Input() status!: ApiStatus;
    @Input() tags: string[] = [];

    @Output() selectTag = new EventEmitter<string>();
}
