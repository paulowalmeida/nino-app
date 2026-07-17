import ky, { HTTPError, TimeoutError, type ResponsePromise } from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
import type { ApiFactoryParams, ApiFactoryType } from '@custom_types/http'
import { ApiError } from '@utils/api-error'
import { endSession } from '@utils/end-session'

const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * Routes where a 401 means wrong credentials, not an expired session —
 * refreshing and retrying there would mask the user's real error.
 */
const PUBLIC_PATHS = [
  'auth/login',
  'auth/signup',
  'auth/refresh',
  'auth/check-availability',
]

const isPublicPath = (url: string): boolean => {
  const { pathname } = new URL(url)
  return PUBLIC_PATHS.some((path) => pathname.endsWith(`/${path}`))
}

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
    if (status === 401 && !isPublicPath(error.request.url)) endSession()
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
          if (isPublicPath(request.url)) throw error

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
