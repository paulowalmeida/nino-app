import { createHttpClient } from '@nino/lib/lib/http-client'
import { createApi } from '@nino/lib/services/http.service'

const SESSION_HINT = 'nino-backoffice-had-session'

const clearSessionHint = () => {
  window.localStorage.removeItem(SESSION_HINT)
  window.dispatchEvent(new Event('backoffice-session-ended'))
}

const client = createHttpClient({
  baseUrl: import.meta.env.VITE_BASE_URL || '/api',
  refreshPath: 'backoffice/auth/refresh',
  exemptPaths: ['backoffice/auth/login', 'backoffice/auth/refresh', 'backoffice/auth/logout'],
  sessionProbePath: 'backoffice/auth/me',
  hasPriorSession: () => window.localStorage.getItem(SESSION_HINT) === '1',
  onUnrecoverable: clearSessionHint,
  httpErrorLabels: {
    401: 'Sua sessão expirou. Entre novamente para continuar.',
    403: 'Você não tem permissão para acessar este recurso.',
  },
})

export const api = createApi(client)

export const sessionHint = {
  mark: () => window.localStorage.setItem(SESSION_HINT, '1'),
  clear: clearSessionHint,
}
