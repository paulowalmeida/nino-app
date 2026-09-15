import { createHttpClient } from '@nino/lib/lib/http-client'
import { createApi } from '@nino/lib/services/http.service'
import { HTTP_ERRORS } from '@shared/constants/http.constants'
import { endSession } from '@shared/services/session/end-session'
import { hadSession } from '@shared/utils/session-hint/session-hint'

const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * Rotas onde 401 é resposta, não sessão expirada: credencial errada, e-mail já
 * em uso, token de refresh vencido. Renovar e repetir aqui mascararia o erro
 * real de quem está na tela.
 */
const EXEMPT_PATHS = [
  'auth/login',
  'auth/signup',
  'session-manager/refresh',
  'auth/check-availability',
  'auth/forgot-password',
  'auth/reset-password',
]

/**
 * A sondagem de sessão. Um 401 aqui pode ser das duas coisas — token expirado
 * (renova e repete, como qualquer rota) ou visitante sem sessão (resposta
 * legítima) —, então ela renova como as demais mas nunca derruba a sessão:
 * telas públicas perguntam quem está logado e não podem ser expulsas por isso.
 */
const SESSION_PROBE_PATH = 'auth/me'

const client = createHttpClient({
  baseUrl: BASE_URL,
  refreshPath: 'session-manager/refresh',
  exemptPaths: EXEMPT_PATHS,
  sessionProbePath: SESSION_PROBE_PATH,
  hasPriorSession: hadSession,
  onUnrecoverable: endSession,
  httpErrorLabels: HTTP_ERRORS,
})

/**
 * Instância única, compartilhada por todo domain service — evita cada
 * `*.service.ts` criar seu próprio client por baixo.
 */
export const api = createApi(client)
