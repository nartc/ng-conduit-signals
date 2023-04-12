import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ArticleService } from './article.service';

@Component({
    standalone: true,
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ArticleService],
})
export default class Article {
    protected readonly articleService = inject(ArticleService);

    @Input() set slug(slug: string) {
        this.articleService.getArticle(slug);
    }
}
