/** How the panel groups the queue: by what the store does next. */
export type OrderStage =
  | 'incoming'
  | 'kitchen'
  | 'street'
  | 'counter'
  | 'closed'
