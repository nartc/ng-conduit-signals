import type { Comment } from '../shared-data-access-api';

export type CommentWithOwner = Comment & { isOwner: boolean };
