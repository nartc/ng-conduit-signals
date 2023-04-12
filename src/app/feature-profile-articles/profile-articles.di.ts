import { InjectionToken, Provider } from '@angular/core';

export type ProfileArticlesType = 'my' | 'favorites';

export const PROFILE_ARTICLES_TYPE = new InjectionToken<ProfileArticlesType>('articles type in profile');

export function provideProfileArticlesType(type: ProfileArticlesType): Provider {
    return { provide: PROFILE_ARTICLES_TYPE, useValue: type };
}
