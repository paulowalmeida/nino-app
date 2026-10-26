export type StoreSubmitResult =
  | { status: 'success' }
  | { status: 'slug-taken' }
  | { status: 'offline' }
  | { status: 'error' }
