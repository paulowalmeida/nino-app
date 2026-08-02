import ky, { HTTPError, TimeoutError, type ResponsePromise } from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
import type { ApiFactoryParams, ApiFactoryType } from '@custom_types/http'
import { ApiError } from '@utils/api-error'
import { endSession } from '@utils/end-session'
import { hadSession } from '@utils/session-hint'

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

export const ApiFactory = ({
  baseUrl = BASE_URL,
}: ApiFactoryParams = {}): ApiFactoryType => {
  /** Bare client: refreshing the session must not trigger its own refresh. */
  const plain = ky.create({ prefix: baseUrl, credentials: 'include' })

  /**
   * One renewal at a time: N requests hitting 401 together share the same
   * promise instead of firing N concurrent refreshes.
   */
  let refreshing: Promise<boolean> | null = null

  const refreshSession = (): Promise<boolean> => {
    refreshing ??= plain
      .post('auth/refresh')
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshing = null
      })

    return refreshing
  }

  const client = plain.extend({
    retry: {
      limit: 1,
      methods: ['get', 'post', 'put', 'patch', 'delete', 'head'],
      statusCodes: [401],
    },
    hooks: {
      beforeRetry: [
        async ({ request, error }) => {
          if (isCredentialPath(request.url)) throw error

          /*
           * Sem sessão anterior neste browser não há o que renovar: quem abre
           * o painel deslogado pagava uma ida e volta à API só para ouvir 401
           * antes de ver a tela de login.
           */
          if (!hadSession()) throw error

          const refreshed = await refreshSession()
          if (!refreshed) throw error
        },
      ],
    },
  })

  const execute = <T>(request: ResponsePromise): Promise<T> =>
    request.json<T>().catch(handleError)

  const getAll = <
    ParamsType extends Record<string, string | number | boolean>,
    ReturnType,
  >(
    url: string,
    params?: ParamsType
  ): Promise<ReturnType> =>
    execute<ReturnType>(client.get(url, { searchParams: params }))

  const get = <ReturnType>(url: string): Promise<ReturnType> =>
    execute<ReturnType>(client.get(url))

  const getById = <ReturnType>(
    url: string,
    id: string | number
  ): Promise<ReturnType> => execute<ReturnType>(client.get(`${url}/${id}`))

  const create = <BodyType, ReturnType>(
    url: string,
    body?: BodyType
  ): Promise<ReturnType> => execute<ReturnType>(client.post(url, { json: body }))

  const update = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> =>
    execute<ReturnType>(client.put(`${url}/${id}`, { json: body }))

  const patch = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> =>
    execute<ReturnType>(client.patch(`${url}/${id}`, { json: body }))

  const remove = <ReturnType>(
    url: string,
    id: string | number
  ): Promise<ReturnType> => execute<ReturnType>(client.delete(`${url}/${id}`))

  return { getAll, get, getById, create, update, patch, remove }
}
