export const canReorderCatalog = (
  categoryId: string | null,
  search: string
) => !!categoryId && !search
