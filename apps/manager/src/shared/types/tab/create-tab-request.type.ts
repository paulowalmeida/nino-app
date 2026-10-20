export type CreateTabRequest =
  | { diningTableId: string; label?: never }
  | { label: string; diningTableId?: never }
