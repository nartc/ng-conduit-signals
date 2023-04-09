import { TagsApiClient } from '../shared-data-access-api';
import { createInjectionToken } from '../shared-utils/create-injection-token';
import { tagsApiFactory } from './tags-api.factory';

export const [injectTagsApi, provideTagsApi, TAGS_API] = createInjectionToken(tagsApiFactory, {
    deps: [TagsApiClient],
    isRoot: false,
});
