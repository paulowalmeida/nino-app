/**
 * O que muda de um front pra outro: onde renovar a sessão, quais rotas não
 * devem tentar renovar (401 ali é credencial errada, não sessão vencida) e o
 * que fazer quando a sessão está mesmo morta. O resto — retry, dedup de
 * refresh concorrente, parse de erro — é igual em qualquer front.
 */
export type HttpClientConfig = {
  baseUrl: string

  /** Endpoint que renova a sessão — ex.: `auth/refresh`, `consumer/auth/refresh`. */
  refreshPath: string

  /** Rotas onde 401 é resposta (credencial errada, refresh vencido) — nunca renova. */
  exemptPaths: string[]

  /**
   * Rota de sondagem de sessão (ex.: `auth/me`) — pode levar 401 de visitante
   * sem sessão, o que é resposta legítima, não motivo pra `onUnrecoverable`.
   */
  sessionProbePath?: string

  /** Se existiu sessão neste navegador — sem isso não há o que renovar. */
  hasPriorSession: () => boolean

  /** Chamado quando o 401 é mesmo irrecuperável (refresh falhou ou repetição
      ainda voltou 401 fora de `exemptPaths`/`sessionProbePath`). */
  onUnrecoverable?: () => void

  /** Texto de erro quando a API não manda mensagem própria. */
  httpErrorLabels?: Record<number, string>
}
