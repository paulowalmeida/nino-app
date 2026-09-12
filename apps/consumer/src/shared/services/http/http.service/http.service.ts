import { createHttpClient } from '@nino/lib/lib/http-client'
import { createApi } from '@nino/lib/services/http.service'
import { HTTP_ERRORS } from '@constants/http.constants'
import { hadSession } from '@utils/session-hint'

const BASE_URL = import.meta.env.VITE_BASE_URL as string

/**
 * Rotas onde 401 é credencial errada, não sessão vencida — renovar e repetir
 * ali esconderia o erro real de quem digitou o código trocado.
 */
const EXEMPT_PATHS = [
  'consumer/auth/otp/request',
  'consumer/auth/otp/verify',
  'consumer/auth/refresh',
  'consumer/auth/logout',
]

const client = createHttpClient({
  baseUrl: BASE_URL,
  refreshPath: 'consumer/auth/refresh',
  exemptPaths: EXEMPT_PATHS,
  hasPriorSession: hadSession,
  httpErrorLabels: HTTP_ERRORS,
})

/**
 * Instância única, compartilhada por todo domain service — evita cada
 * `*.service.ts` criar seu próprio client por baixo.
 */
export const api = createApi(client)
