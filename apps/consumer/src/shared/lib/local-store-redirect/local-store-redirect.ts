const LOCAL_HOST = 'localhost'

/**
 * Em desenvolvimento a loja abre de dois jeitos: por subdomínio
 * (`burgao-centro.localhost:3002`) ou por caminho
 * (`localhost:3002/burgao-centro`). Só o caminho fecha o login: o cookie de
 * sessão não declara `domain`, então nasce preso ao host que respondeu — pelo
 * proxy do Vite, sempre `localhost` — e o navegador nunca o devolve para um
 * subdomínio. Quem chega pelo subdomínio recebe aqui o endereço equivalente
 * em caminho.
 *
 * Devolve `null` quando não há o que corrigir, o que inclui produção: nenhum
 * host de loja publicada termina em `.localhost`.
 */
export const resolveLocalStoreRedirect = (href: string): string | null => {
  const url = new URL(href)
  const suffix = `.${LOCAL_HOST}`

  if (!url.hostname.endsWith(suffix)) return null

  const slug = url.hostname.slice(0, -suffix.length)
  if (slug.includes('.')) return null

  const port = url.port ? `:${url.port}` : ''
  const path = url.pathname === '/' ? '' : url.pathname
  const origin = `${url.protocol}//${LOCAL_HOST}${port}`

  return `${origin}/${slug}${path}${url.search}${url.hash}`
}
