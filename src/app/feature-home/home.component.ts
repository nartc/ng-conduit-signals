import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectHomeApi, provideHomeApi } from '../data-access-home/home-api.di';
import { injectTagsApi } from '../data-access-home/tags-api.di';
import { injectAuthApi } from '../shared-data-access-auth/auth-api.di';
import { UiHomeBanner } from '../ui-home/banner/banner.component';
import { UiHomeFeedToggle } from '../ui-home/feed-toggle/feed-toggle.component';
import { UiHomeTags } from '../ui-home/tags/tags.component';

@Component({
    standalone: true,
    template: `
        <app-ui-home-banner />

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <app-ui-home-feed-toggle
                        [selectedTag]="tagsApi.selectedTag()"
                        [isFeedDisabled]="!authApi.isAuthenticated()"
                        [feedType]="homeApi.feedType()"
                        (selectFeed)="onFeedSelected()"
                        (selectGlobal)="onGlobalSelected()"
                    />
                </div>

                <div class="col-md-3">
                    <app-ui-home-tags
                        [status]="tagsApi.status()"
                        [tags]="tagsApi.tags()"
                        (selectTag)="onTagSelected($event)"
                    >
                        <p>Loading...</p>
                    </app-ui-home-tags>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideHomeApi()],
    host: { class: 'block home-page' },
    imports: [UiHomeBanner, UiHomeTags, UiHomeFeedToggle],
})
export default class Home {
    protected readonly homeApi = injectHomeApi();
    protected readonly tagsApi = injectTagsApi();
    protected readonly authApi = injectAuthApi();

    onTagSelected(tag: string) {
        this.tagsApi.selectTag(tag);
        this.homeApi.setFeedType('tag');
    }

    onFeedSelected() {
        this.tagsApi.selectTag('');
        this.homeApi.setFeedType('feed');
    }

    onGlobalSelected() {
        this.tagsApi.selectTag('');
        this.homeApi.setFeedType('global');
    }
}
