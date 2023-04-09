import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedType } from 'src/app/shared-data-access-models/feed-type';

@Component({
    selector: 'app-ui-home-feed-toggle',
    standalone: true,
    template: `
        <ul class="nav nav-pills outline-active">
            <li class="nav-item">
                <a
                    class="nav-link"
                    [class.disabled]="isFeedDisabled"
                    [class.active]="feedType === 'feed' && !selectedTag"
                    (click)="!isFeedDisabled && selectFeed.emit()"
                >
                    Your Feed
                </a>
            </li>
            <li class="nav-item">
                <a
                    class="nav-link"
                    [class.active]="feedType === 'global' && !selectedTag"
                    (click)="selectGlobal.emit()"
                >
                    Global Feed
                </a>
            </li>
            <li class="nav-item" *ngIf="selectedTag">
                <a class="nav-link active">#{{ selectedTag }}</a>
            </li>
        </ul>
    `,
    imports: [NgIf],
    host: { class: 'block feed-toggle' },
})
export class UiHomeFeedToggle {
    @Input() selectedTag?: string;
    @Input() feedType: FeedType = 'global';
    @Input() isFeedDisabled = true;

    @Output() selectGlobal = new EventEmitter();
    @Output() selectFeed = new EventEmitter();
}
