/**
 * Uma renovação por vez em todo o navegador — não só nesta aba.
 *
 * A API rotaciona o refresh token e trata repetição como ataque: dois
 * `POST /auth/refresh` com o mesmo cookie derrubam a sessão inteira com
 * "Refresh token reuse detected". Um lock em variável de módulo só protege
 * chamadas dentro do mesmo processo JS — abrir o painel em duas abas cria dois
 * processos, cada um com seu próprio lock, e as duas podem renovar ao mesmo
 * tempo com o cookie que ainda é o mesmo (cookie é do navegador, não da aba).
 * Cliente com duas abas é o caso comum, não a exceção, então isso não pode
 * depender de quantas abas existem.
 *
 * A Web Locks API resolve isso: `navigator.locks` é do navegador, compartilhada
 * por todas as abas da mesma origem, e enfileira quem pede o mesmo nome de
 * lock — inclusive entre abas.
 *
 * Falta uma peça: quando a aba B destrava depois da aba A já ter renovado, ela
 * não deve renovar de novo — o cookie que A deixou já está bom. Por isso a
 * marca `lastRefreshAt` no `localStorage` (ele sim é do navegador inteiro):
 * quem destrava e vê uma renovação recente demais devolve sucesso sem bater
 * na API, e quem chamou tenta de novo a requisição original com o cookie já
 * fresco.
 */
const LOCK_NAME = 'nino-refresh-session'
const LAST_REFRESH_KEY = 'nino.last-refresh-at'

/* Maior que uma ida e volta de rede folgada, curto o bastante para nunca
 * mascarar uma renovação que de fato precisa acontecer. */
const FRESH_WINDOW_MS = 5000

const recentlyRefreshed = (): boolean => {
  try {
    const at = Number(window.localStorage.getItem(LAST_REFRESH_KEY))
    return Number.isFinite(at) && Date.now() - at < FRESH_WINDOW_MS
  } catch {
    return false
  }
}

const markRefreshed = (): void => {
  try {
    window.localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()))
  } catch {
    /* sem storage (modo privado, cota cheia): a próxima aba só perde a folga
     * e tenta renovar de novo — não é o fim do mundo, é uma ida a mais. */
  }
}

/* Fallback para quando `navigator.locks` não existe (Safari < 15.4, testes em
 * jsdom): protege ao menos a aba atual, que é o que o código fazia antes. */
let sameTabRun: Promise<boolean> | null = null

const withoutCrossTabLock = (renew: () => Promise<boolean>): Promise<boolean> => {
  sameTabRun ??= renew().finally(() => {
    sameTabRun = null
  })

  return sameTabRun
}

export const refreshOnce = (renew: () => Promise<boolean>): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.locks) {
    return withoutCrossTabLock(renew)
  }

  return navigator.locks.request(LOCK_NAME, async () => {
    if (recentlyRefreshed()) return true

    const refreshed = await renew()
    if (refreshed) markRefreshed()

    return refreshed
  })
}
