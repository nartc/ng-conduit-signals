import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-shared-ui-form-layout',
    template: `
        <div class="container page">
            <div class="row">
                <div [class]="innerClass">
                    <ng-content />
                </div>
            </div>
        </div>
    `,
    standalone: true,
    host: { '[style.display]': "'block'" },
})
export class SharedUiFormLayout {
    @Input() innerClass = '';
}
