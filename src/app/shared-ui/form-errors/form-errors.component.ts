import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormErrorsApi } from 'src/app/shared-data-access-form-errors/form-errors-api.factory';

@Component({
    selector: 'app-shared-ui-form-errors',
    standalone: true,
    template: `
        <ul class="error-messages" *ngIf="errors.hasError">
            <li *ngFor="let error of errors.errors">{{ error }}</li>
        </ul>
    `,
    imports: [NgFor, NgIf],
    host: {
        '[style.display]': '"contents"',
    },
})
export class SharedUiFormErrors {
    @Input() errors!: ReturnType<FormErrorsApi['formErrors']>;
}
