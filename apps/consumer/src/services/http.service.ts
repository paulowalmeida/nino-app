import type { HttpClient } from '@custom_types/http/http-client'
import type { HttpSearchParams } from '@custom_types/http/http-client'
import { createHttpClient } from '@lib/http-client'

const HttpFactory = (client: HttpClient = createHttpClient()) => ({
  get: <ReturnType>(url: string): Promise<ReturnType> => client.get(url),

  getWith: <ReturnType>(
    url: string,
    searchParams: HttpSearchParams
  ): Promise<ReturnType> => client.get(url, { searchParams }),

  post: <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => client.post(url, body),

  patch: <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => client.patch(url, body),

  remove: <ReturnType>(url: string): Promise<ReturnType> => client.delete(url),
})

/**
 * Instância única, compartilhada por todo domain service — evita cada
 * `*.service.ts` criar seu próprio `HttpClient` (e, com ele, seu próprio
 * client `ky`) por baixo.
 */
export const api = HttpFactory()
