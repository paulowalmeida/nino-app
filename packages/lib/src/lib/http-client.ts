import ky, {
  HTTPError,
  TimeoutError,
  type KyInstance,
  type ResponsePromise,
} from 'ky'

import type { HttpClient } from '../types/http/http-client'
import type { HttpClientConfig } from '../types/http/http-client-config'
import { ApiError } from '../utils/api-error'
import { refreshOnce } from './refresh-lock'

const matches = (url: string, paths: string[]): boolean => {
  const { pathname } = new URL(url)
  return paths.some((path) => pathname.endsWith(`/${path}`))
}

const createBareClient = (baseUrl: string): KyInstance =>
  ky.create({ prefix: baseUrl, credentials: 'include' })

/**
 * `error.data` é o que o `ky` dá em troca do corpo cru: ele já consumiu o
 * stream da resposta pra popular esse campo, então `error.response.json()`
 * não funciona mais depois disso — `error.data` é o único jeito que sobra
 * de ler a mensagem que o backend mandou.
 */
const parseMessage = (
  data: unknown,
  status: number,
  statusText: string,
  httpErrorLabels: Record<number, string> | undefined
): string => {
  const fallback = httpErrorLabels?.[status] ?? statusText
  const { message } = (data ?? {}) as { message?: string | string[] }
  if (Array.isArray(message)) return message.join(', ')
  return message ?? fallback
}

/**
 * Client HTTP base, ciente de sessão — encapsula `ky` por completo, sem
 * vazar nada dele pra fora. O que muda por front (rotas de renovação, o que
 * fazer quando a sessão está morta) chega por `config`; o resto — retry,
 * dedup de refresh concorrente, parse de erro — é igual em qualquer front.
 */
export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  const bareClient = createBareClient(config.baseUrl)

  /* O lock é entre abas, não só deste client — ver `refresh-lock.ts`. */
  const refreshSession = (): Promise<boolean> =>
    refreshOnce(() =>
      bareClient
        .post(config.refreshPath)
        .then(() => true)
        .catch(() => false)
    )

  const endsSessionOn401 = (url: string): boolean => {
    const exempt = config.sessionProbePath
      ? [...config.exemptPaths, config.sessionProbePath]
      : config.exemptPaths
    return !matches(url, exempt)
  }

  const transport = bareClient.extend({
    retry: {
      limit: 1,
      methods: ['get', 'post', 'put', 'patch', 'delete', 'head'],
      statusCodes: [401],
    },
    hooks: {
      beforeRetry: [
        async ({ request, error }) => {
          if (matches(request.url, config.exemptPaths)) throw error

          /* sem sessão anterior neste browser não há o que renovar */
          if (!config.hasPriorSession()) throw error

          const refreshed = await refreshSession()
          if (!refreshed) throw error
        },
      ],
    },
  })

  const handleError = async (error: unknown): Promise<never> => {
    if (error instanceof HTTPError) {
      const { status, statusText } = error.response
      if (status === 401 && endsSessionOn401(error.request.url)) {
        config.onUnrecoverable?.()
      }
      throw new ApiError(
        status,
        parseMessage(error.data, status, statusText, config.httpErrorLabels)
      )
    }
    if (error instanceof TimeoutError) {
      throw new ApiError(0, 'Request timed out')
    }
    throw error
  }

  // WHY: corpo vazio (Nest manda `response.send()` sem corpo pra `null`/`undefined`) faz `response.json()` lançar; ler como texto primeiro deixa isso virar `null` de verdade.
  const run = async <T>(request: ResponsePromise): Promise<T> => {
    try {
      const response = await request
      const text = await response.text()
      return (text ? JSON.parse(text) : null) as T
    } catch (error) {
      return handleError(error)
    }
  }

  return {
    get: (url, options) =>
      run(transport.get(url, { searchParams: options?.searchParams })),
    post: (url, body) => run(transport.post(url, { json: body })),
    postFormData: (url, body) => run(transport.post(url, { body })),
    put: (url, body) => run(transport.put(url, { json: body })),
    patch: (url, body) => run(transport.patch(url, { json: body })),
    delete: (url, body) =>
      run(transport.delete(url, body ? { json: body } : undefined)),
  }
}
