const PUBLISHED_BASE = 'dev.nino.delivery'
const LOCAL_STORE_ORIGIN = 'http://localhost:3002'

const isLocal = (hostname: string): boolean =>
  hostname === 'localhost' || hostname.endsWith('.localhost')

/**
 * A loja publicada mora num subdomínio (`minha-loja.dev.nino.delivery`); o
 * consumer rodando na máquina, não. Lá a loja é um caminho em
 * `localhost:3002`, porque o cookie de sessão é host-only e não atravessa
 * para um subdomínio de `.localhost` — pelo subdomínio o login com Google
 * nunca fecha. As portas de dev são fixas por causa do CORS da API: gestor
 * 3001, consumer 3002.
 */
export const storeUrlFor = (slug: string, hostname: string): string =>
  isLocal(hostname)
    ? `${LOCAL_STORE_ORIGIN}/${slug}`
    : `https://${slug}.${PUBLISHED_BASE}`
