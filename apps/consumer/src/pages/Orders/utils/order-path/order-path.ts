export const orderPath = (slug: string | undefined, id: string) =>
  slug ? `/${slug}/pedido/${id}` : `/pedido/${id}`
