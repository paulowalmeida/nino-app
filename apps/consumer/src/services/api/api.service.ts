import ky, { HTTPError, TimeoutError, type ResponsePromise } from 'ky'

import { HTTP_ERRORS } from '@constants/http.constants'
import { ApiError } from '@utils/api-error'

const BASE_URL = import.meta.env.VITE_BASE_URL as string

/**
 * Cliente do consumidor: a vitrine, o cardápio e o pedido guest são todos
 * endpoints públicos, então não há sessão para renovar — um ky enxuto basta.
 * `credentials: 'include'` fica pronto para quando o cliente logado entrar.
 */
const client = ky.create({ prefix: BASE_URL, credentials: 'include' })

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
