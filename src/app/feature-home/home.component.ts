import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { injectFavoriteApi } from '../data-access-home/favorite-api.di';
import { injectHomeApi, provideHomeApi } from '../data-access-home/home-api.di';
import { injectTagsApi, provideTagsApi } from '../data-access-home/tags-api.di';
import { injectAuthApi } from '../shared-data-access-auth/auth-api.di';
import { SharedUiArticlesList } from '../shared-ui/articles-list/articles-list.component';
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
                        [selectedTag]="homeApi.selectedTag()"
                        [isFeedDisabled]="!authApi.isAuthenticated()"
                        [feedType]="homeApi.feedType()"
                        (selectFeed)="homeApi.getArticles('feed')"
                        (selectGlobal)="homeApi.getArticles('global')"
                    />
                    <app-shared-ui-articles-list
                        [status]="homeApi.status()"
                        [articles]="homeApi.articles()"
                        (toggleFavorite)="favoriteApi.toggleFavorite($event)"
                    />
                </div>

                <div class="col-md-3">
                    <app-ui-home-tags
                        [status]="tagsApi.status()"
                        [tags]="tagsApi.tags()"
                        (selectTag)="homeApi.getArticles('tag', $event)"
                    >
                        <p>Loading...</p>
                    </app-ui-home-tags>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideHomeApi(), provideTagsApi()],
    host: { class: 'block home-page' },
    imports: [UiHomeBanner, UiHomeTags, UiHomeFeedToggle, SharedUiArticlesList],
})
export default class Home implements OnInit {
    protected readonly homeApi = injectHomeApi();
    protected readonly favoriteApi = injectFavoriteApi();
    protected readonly tagsApi = injectTagsApi();
    protected readonly authApi = injectAuthApi();

    ngOnInit() {
        this.tagsApi.getTags();
        this.homeApi.getArticles('global');
    }
}
