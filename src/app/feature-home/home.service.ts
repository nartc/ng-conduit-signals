import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { defer, lastValueFrom } from 'rxjs';
import { Article, ArticlesApiClient } from '../shared-data-access-api';
import { FavoriteArticleService } from '../shared-data-access-favorite-article/favorite-article.service';
import { ApiStatus } from '../shared-data-access-models/api-status';
import { FeedType } from '../shared-data-access-models/feed-type';

@Injectable()
export class HomeService {
    private readonly articlesApiClient = inject(ArticlesApiClient);
    private readonly favoriteArticleService = inject(FavoriteArticleService);

    private readonly status = signal<ApiStatus>('idle');
    private readonly feedType = signal<FeedType>('global');
    private readonly selectedTag = signal('');
    private readonly articles = signal<Article[]>([]);

    readonly vm = {
        articles: computed(() => {
            const articles = this.articles();
            const toggledFavorite = this.favoriteArticleService.vm.toggledFavorite();
            if (toggledFavorite) {
                return articles.map((article) => {
                    if (article.slug === toggledFavorite.slug) return toggledFavorite;
                    return article;
                });
            }
            return articles;
        }),
        status: () => this.status(),
        feedType: () => this.feedType(),
        selectedTag: () => this.selectedTag(),
    };

    getArticles(type: FeedType, tag?: string) {
        this.status.set('loading');
        this.feedType.set(type);
        this.selectedTag.set(tag || '');

        lastValueFrom(
            defer(() => {
                if (type === 'feed') return this.articlesApiClient.getArticlesFeed();
                if (type === 'tag' && tag) {
                    return this.articlesApiClient.getArticles({ tag });
                }
                return this.articlesApiClient.getArticles();
            })
        )
            .then((response) => {
                this.status.set('success');
                this.articles.set(response.articles);
            })
            .catch(({ error }: HttpErrorResponse) => {
                console.error(`Error getting articles for ${type}`, error);
                this.status.set('error');
                this.articles.set([]);
            });
    }
}
