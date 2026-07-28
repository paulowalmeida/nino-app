import ky, { HTTPError, TimeoutError, type ResponsePromise } from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
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

/** Cliente pelado: renovar a sessão não pode disparar a própria renovação. */
const plain = ky.create({ prefix: BASE_URL, credentials: 'include' })

/**
 * Uma renovação por vez: N requisições que batem 401 juntas dividem a mesma
 * promise em vez de dispararem N refreshes concorrentes.
 */
let refreshing: Promise<boolean> | null = null

const refreshSession = (): Promise<boolean> => {
  refreshing ??= plain
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
const client = plain.extend({
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
           neste navegador não há o que renovar, e cobrar um refresh de quem
           só quer ver o cardápio é uma ida e volta jogada fora */
        if (!hadSession()) throw error

        const refreshed = await refreshSession()
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

export const get = <T>(url: string): Promise<T> => run<T>(client.get(url))

export const getWith = <T>(
  url: string,
  params: Record<string, string | number>
): Promise<T> => run<T>(client.get(url, { searchParams: params }))

export const post = <B, T>(url: string, body: B): Promise<T> =>
  run<T>(client.post(url, { json: body }))

export const patch = <B, T>(url: string, body: B): Promise<T> =>
  run<T>(client.patch(url, { json: body }))

export const del = <T>(url: string): Promise<T> => run<T>(client.delete(url))
