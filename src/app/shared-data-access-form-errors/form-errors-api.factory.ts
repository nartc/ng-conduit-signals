import { computed, signal } from '@angular/core';

function processErrorsRecord(errors: Record<string, string[]>): {
    errors: string[];
    hasError: boolean;
} {
    const errorEntries = Object.entries(errors);
    return {
        errors: errorEntries.reduce((authErrors, curr) => {
            authErrors.push(...curr[1].map((error) => `${curr[0]} ${error}`));
            return authErrors;
        }, [] as string[]),
        hasError: errorEntries.length > 0,
    };
}

export function formErrorsApiFactory() {
    const errors = signal<Record<string, string[]>>({});

    const formErrors = computed(() => processErrorsRecord(errors()));

    return {
        formErrors,
        updateErrors: errors.set.bind(errors),
    };
}

export type FormErrorsApi = ReturnType<typeof formErrorsApiFactory>;
