import { InjectionToken } from '@angular/core';
import { FormErrorsApi, formErrorsApiFactory } from './form-errors-api.factory';

export const FORM_ERRORS_API = new InjectionToken<FormErrorsApi>('FormErrors API');

export function provideFormErrorsApi() {
    return { provide: FORM_ERRORS_API, useFactory: formErrorsApiFactory };
}
