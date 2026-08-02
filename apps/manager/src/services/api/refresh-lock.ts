/**
 * Uma renovação por vez em toda a aplicação.
 *
 * A API rotaciona o refresh token e trata repetição como ataque: dois
 * `POST /auth/refresh` com o mesmo cookie derrubam a sessão inteira com
 * "Refresh token reuse detected". Como cada módulo de serviço cria seu próprio
 * cliente HTTP, um lock por instância não segura nada — quando quatro chamadas
 * de módulos diferentes tomam 401 juntas, saem quatro renovações. O estado
 * mora aqui, no escopo do módulo, que é único para todos eles.
 */
let running: Promise<boolean> | null = null

export const refreshOnce = (renew: () => Promise<boolean>): Promise<boolean> => {
  running ??= renew().finally(() => {
    running = null
  })

  return running
}
