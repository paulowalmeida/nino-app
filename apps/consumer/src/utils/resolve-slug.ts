/**
 * Domínios-base do consumer. Um subdomínio de qualquer um deles é uma loja:
 * `burgao-do-nino.nino.delivery` em produção, `burgao-do-nino.localhost` no
 * desenvolvimento (o browser resolve `*.localhost` sem editar /etc/hosts).
 */
const BASE_DOMAINS = ['nino.delivery', 'localhost']

/**
 * O slug carregado pelo host, quando há um. Só um nível de subdomínio vira
 * loja — `a.b.nino.delivery` não é uma. O domínio nu (`nino.delivery`,
 * `localhost`) não tem loja e devolve `null`, deixando o caminho decidir.
 */
export const slugFromHost = (host: string): string | null => {
  for (const base of BASE_DOMAINS) {
    if (host === base) return null
    if (host.endsWith(`.${base}`)) {
      const label = host.slice(0, -(base.length + 1))
      return label.includes('.') ? null : label
    }
  }
  return null
}

/**
 * A loja da requisição: o subdomínio manda (produção e domínio próprio via
 * `*.localhost`); sem ele, cai no `:slug` do caminho — o modo de dev em
 * `localhost/slug`, sem precisar de subdomínio.
 */
export const resolveSlug = (pathSlug: string | undefined): string | null =>
  slugFromHost(window.location.hostname) ?? pathSlug ?? null
