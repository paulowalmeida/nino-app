/** O cardápio da loja quando há slug de rota, ou a home fora de loja. */
export const resolveBackHref = (pathSlug: string | undefined): string =>
  pathSlug ? `/${pathSlug}` : '/'
