import ky, {
  HTTPError,
  TimeoutError,
  type KyInstance,
  type ResponsePromise,
} from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
import type { HttpClient } from '@custom_types/http/http-client'
import { ApiError } from '@utils/api-error'
import { hadSession } from '@utils/session-hint'

const BASE_URL = import.meta.env.VITE_BASE_URL as string

/**
 * Rotas onde 401 é credencial errada, não sessão vencida — renovar e repetir
 * ali esconderia o erro real de quem digitou o código trocado.
 */
const PUBLIC_PATHS = [
  'customer/auth/otp/request',
  'customer/auth/otp/verify',
  'customer/auth/refresh',
  'customer/auth/logout',
]

const isPublicPath = (url: string): boolean => {
  const { pathname } = new URL(url, window.location.origin)
  return PUBLIC_PATHS.some((path) => pathname.endsWith(`/${path}`))
}

/** Client cru: renovar a sessão não pode disparar a própria renovação. */
const createBareClient = (baseUrl: string): KyInstance =>
  ky.create({ prefix: baseUrl, credentials: 'include' })

/**
 * Uma renovação por vez: N requisições que batem 401 juntas dividem a mesma
 * promise em vez de dispararem N refreshes concorrentes.
 */
let refreshing: Promise<boolean> | null = null

const refreshSession = (bareClient: KyInstance): Promise<boolean> => {
  refreshing ??= bareClient
    .post('customer/auth/refresh')
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })

  return refreshing
}

/**
 * O cliente fica logado até dizer que quer sair. O access token é curto, mas
 * o refresh mora em cookie httpOnly de validade longa: quando o primeiro
 * vence, a requisição que levou 401 é repetida com um token novo, sem a
 * pessoa perceber. Sem isto, fechar o app no meio da tarde e voltar à noite
 * jogava todo mundo de volta na tela de login.
 */
const withSessionRefresh = (bareClient: KyInstance): KyInstance =>
  bareClient.extend({
    retry: {
      limit: 1,
      methods: ['get', 'post', 'put', 'patch', 'delete', 'head'],
      statusCodes: [401],
    },
    hooks: {
      beforeRetry: [
        async ({ request, error }) => {
          if (isPublicPath(request.url)) throw error

          /* a vitrine é feita para visitante anônimo: sem sessão anterior
             neste navegador não há o que renovar, e cobrar um refresh de
             quem só quer ver o cardápio é uma ida e volta jogada fora */
          if (!hadSession()) throw error

          const refreshed = await refreshSession(bareClient)
          if (!refreshed) throw error
        },
      ],
    },
  })

const messageOf = async (response: Response): Promise<string> => {
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

const run = async <T>(request: ResponsePromise): Promise<T> => {
  try {
    return await request.json<T>()
  } catch (error) {
    if (error instanceof HTTPError) {
      throw new ApiError(error.response.status, await messageOf(error.response))
    }
    if (error instanceof TimeoutError) {
      throw new ApiError(0, 'A conexão demorou demais')
    }
    throw error
  }
}

/**
 * Client HTTP base, ciente de sessão — encapsula `ky` por completo, sem
 * vazar nada dele pra fora. Todo `*.service.ts` consome os verbos aqui via
 * `services/http.service.ts`, nunca `ky` direto.
 */
export const createHttpClient = (baseUrl: string = BASE_URL): HttpClient => {
  const transport = withSessionRefresh(createBareClient(baseUrl))

  return {
    get: (url, options) =>
      run(transport.get(url, { searchParams: options?.searchParams })),
    post: (url, body) => run(transport.post(url, { json: body })),
    patch: (url, body) => run(transport.patch(url, { json: body })),
    delete: (url) => run(transport.delete(url)),
  }
}
