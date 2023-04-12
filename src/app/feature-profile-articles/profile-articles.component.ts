import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { SharedUiArticlesList } from '../shared-ui/articles-list/articles-list.component';
import { ProfileArticlesService } from './profile-articles.service';

@Component({
    template: `
        <app-shared-ui-articles-list
            [status]="profileArticlesService.status()"
            [articles]="profileArticlesService.articles()"
            (toggleFavorite)="profileArticlesService.toggleFavorite($event)"
        />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [ProfileArticlesService, FavoriteArticleService],
    imports: [SharedUiArticlesList],
})
export default class ProfileArticles implements OnInit {
    protected readonly profileArticlesService = inject(ProfileArticlesService);

    ngOnInit() {
        this.profileArticlesService.getArticles();
    }
}
