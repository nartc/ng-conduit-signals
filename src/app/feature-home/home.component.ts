import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiHomeBanner } from '../ui-home/banner/banner.component';

@Component({
    standalone: true,
    template: `
        <div class="home-page">
            <app-ui-home-banner />

            <div class="container page">
                <div class="row">
                    <div class="col-md-9"></div>

                    <div class="col-md-3"></div>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UiHomeBanner],
})
export default class Home {}
