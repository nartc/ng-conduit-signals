import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../shared-data-access-auth/auth.service';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { SharedUiArticlesList } from '../shared-ui/articles-list/articles-list.component';
import { UiHomeBanner } from '../ui-home/banner/banner.component';
import { UiHomeFeedToggle } from '../ui-home/feed-toggle/feed-toggle.component';
import { UiHomeTags } from '../ui-home/tags/tags.component';
import { HomeService } from './home.service';
import { TagsService } from './tags.service';

@Component({
    standalone: true,
    template: `
        <app-ui-home-banner />

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <app-ui-home-feed-toggle
                        [selectedTag]="homeService.selectedTag()"
                        [isFeedDisabled]="!authService.isAuthenticated()"
                        [feedType]="homeService.feedType()"
                        (selectFeed)="homeService.getArticles('feed')"
                        (selectGlobal)="homeService.getArticles('global')"
                    />
                    <app-shared-ui-articles-list
                        [status]="homeService.status()"
                        [articles]="homeService.articles()"
                        (toggleFavorite)="homeService.toggleFavorite($event)"
                    />
                </div>

                <div class="col-md-3">
                    <app-ui-home-tags
                        [status]="tagsService.status()"
                        [tags]="tagsService.tags()"
                        (selectTag)="homeService.getArticles('tag', $event)"
                    >
                        <p>Loading...</p>
                    </app-ui-home-tags>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FavoriteArticleService, HomeService, TagsService],
    host: { class: 'block home-page' },
    imports: [UiHomeBanner, UiHomeTags, UiHomeFeedToggle, SharedUiArticlesList],
})
export default class Home implements OnInit {
    protected readonly homeService = inject(HomeService);
    protected readonly tagsService = inject(TagsService);
    protected readonly authService = inject(AuthService);

    ngOnInit() {
        this.tagsService.getTags();
        this.homeService.getArticles('global');
    }
}
