import ky, {
  HTTPError,
  TimeoutError,
  type KyInstance,
  type ResponsePromise,
} from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
import type { ApiFactoryParams } from '@custom_types/http/api-factory-params'
import type { HttpClient } from '@custom_types/http/http-client'
import { ApiError } from '@utils/api-error'
import { endSession } from '@utils/end-session'
import { hadSession } from '@utils/session-hint'

import { refreshOnce } from './refresh-lock'

/**
 * `ky`, for anyone coming from `axios`:
 *
 * - No `interceptors` — `retry` and `hooks.beforeRetry` split that job in
 *   two. `retry` (below, in `withSessionRefresh`) is what actually repeats
 *   the request; `hooks.beforeRetry` can only cancel that automatic retry by
 *   throwing. There's no manual "call the original request again" anywhere
 *   here, unlike a typical axios 401 interceptor — ky is already retrying,
 *   the hook just decides whether to let it.
 * - `.create()` + `.extend()` instead of `.create()` +
 *   `.interceptors.use()` — `extend` returns a *new* instance layered on
 *   top, it never mutates the one it's called on. That's why the session
 *   refresh below runs on the bare client (`createBareClient`), not the one
 *   wrapped with retry (`withSessionRefresh`): refreshing on the wrapped
 *   instance could itself 401 and try to refresh again.
 */

const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * Rotas onde 401 é resposta, não sessão expirada: credencial errada, e-mail já
 * em uso, token de refresh vencido. Renovar e repetir aqui mascararia o erro
 * real de quem está na tela.
 */
const CREDENTIAL_PATHS = [
  'auth/login',
  'auth/signup',
  'auth/refresh',
  'auth/check-availability',
]

/**
 * A sondagem de sessão. Um 401 aqui pode ser das duas coisas — token expirado
 * (renova e repete, como qualquer rota) ou visitante sem sessão (resposta
 * legítima) —, então ela renova como as demais mas nunca derruba a sessão:
 * telas públicas perguntam quem está logado e não podem ser expulsas por isso.
 */
const SESSION_PROBE = 'auth/me'

const matches = (url: string, paths: string[]): boolean => {
  const { pathname } = new URL(url)
  return paths.some((path) => pathname.endsWith(`/${path}`))
}

const isCredentialPath = (url: string): boolean =>
  matches(url, CREDENTIAL_PATHS)

const endsSessionOn401 = (url: string): boolean =>
  !matches(url, [...CREDENTIAL_PATHS, SESSION_PROBE])

const parseMessage = async (response: Response): Promise<string> => {
  const fallback = HTTP_ERRORS[response.status] ?? response.statusText
  try {
    const body: unknown = await response.clone().json()
    const { message } = body as { message?: string | string[] }
    if (Array.isArray(message)) return message.join(', ')
    return message ?? fallback
  } catch {
    return fallback
  }
}

/**
 * A 401 reaching this point means the session is unrecoverable: either the
 * refresh failed, or the retried request was denied with the fresh token.
 */
const handleError = async (error: unknown): Promise<never> => {
  if (error instanceof HTTPError) {
    const { status } = error.response
    if (status === 401 && endsSessionOn401(error.request.url)) endSession()
    throw new ApiError(status, await parseMessage(error.response))
  }
  if (error instanceof TimeoutError) throw new ApiError(0, 'Request timed out')
  throw error
}

/**
 * Se `false`, a chamada original que levou 401 não deve ser repetida — ver
 * `withSessionRefresh` pra quem lê essa decisão.
 */
const shouldRetryWithFreshSession = async (
  url: string,
  refreshSession: () => Promise<boolean>
): Promise<boolean> => {
  if (isCredentialPath(url)) return false

  /*
   * Sem sessão anterior neste browser não há o que renovar: quem abre o
   * painel deslogado pagava uma ida e volta à API só para ouvir 401 antes de
   * ver a tela de login.
   */
  if (!hadSession()) return false

  return refreshSession()
}

/** Client cru: renovar a sessão não pode disparar a própria renovação. */
const createBareClient = (baseUrl: string): KyInstance =>
  ky.create({ prefix: baseUrl, credentials: 'include' })

/**
 * Envolve o client cru com retry automático em 401: quando a chamada original
 * falha, tenta renovar a sessão e repete uma vez com o token novo.
 */
const withSessionRefresh = (bareClient: KyInstance): KyInstance => {
  /* O lock é do módulo, não desta instância: ver `refresh-lock.ts`. */
  const refreshSession = (): Promise<boolean> =>
    refreshOnce(() =>
      bareClient
        .post('auth/refresh')
        .then(() => true)
        .catch(() => false)
    )

  return bareClient.extend({
    retry: {
      limit: 1,
      methods: ['get', 'post', 'put', 'patch', 'delete', 'head'],
      statusCodes: [401],
    },
    hooks: {
      beforeRetry: [
        async ({ request, error }) => {
          const canRetry = await shouldRetryWithFreshSession(
            request.url,
            refreshSession
          )
          if (!canRetry) throw error
        },
      ],
    },
  })
}

/**
 * Client HTTP base, ciente de sessão — encapsula `ky` por completo, sem
 * vazar nada dele pra fora. Qualquer service pode consumir os verbos
 * parametrizados aqui em vez de passar pelo formato REST-resource do
 * `ApiFactory`.
 */
export const createHttpClient = ({
  baseUrl = BASE_URL,
}: ApiFactoryParams = {}): HttpClient => {
  const transport = withSessionRefresh(createBareClient(baseUrl))
  const execute = <T>(request: ResponsePromise): Promise<T> =>
    request.json<T>().catch(handleError)

  return {
    get: (url, options) => execute(transport.get(url, options)),
    post: (url, body) => execute(transport.post(url, { json: body })),
    put: (url, body) => execute(transport.put(url, { json: body })),
    patch: (url, body) => execute(transport.patch(url, { json: body })),
    delete: (url) => execute(transport.delete(url)),
  }
}
