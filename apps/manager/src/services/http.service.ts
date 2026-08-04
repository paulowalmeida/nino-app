import type { HttpClient } from '@custom_types/http/http-client'
import { createHttpClient } from '@lib/http-client'

type ApiFactoryType = {
  getAll: <
    ParamsType extends Record<string, string | number | boolean>,
    ReturnType,
  >(
    url: string,
    params?: ParamsType
  ) => Promise<ReturnType>
  get: <ReturnType>(url: string) => Promise<ReturnType>
  create: <BodyType, ReturnType>(
    url: string,
    body?: BodyType
  ) => Promise<ReturnType>
  update: <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ) => Promise<ReturnType>
  patch: <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ) => Promise<ReturnType>
  remove: <ReturnType>(url: string, id: string | number) => Promise<ReturnType>
}

const HttpFactory = (
  client: HttpClient = createHttpClient()
): ApiFactoryType => {
  const getAll = <
    ParamsType extends Record<string, string | number | boolean>,
    ReturnType,
  >(
    url: string,
    params?: ParamsType
  ): Promise<ReturnType> =>
    client.get<ReturnType>(url, { searchParams: params })

  const get = <ReturnType>(url: string): Promise<ReturnType> =>
    client.get<ReturnType>(url)

  const create = <BodyType, ReturnType>(
    url: string,
    body?: BodyType
  ): Promise<ReturnType> => client.post<ReturnType, BodyType>(url, body)

  const update = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> =>
    client.put<ReturnType, BodyType>(`${url}/${id}`, body)

  const patch = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> =>
    client.patch<ReturnType, BodyType>(`${url}/${id}`, body)

  const remove = <ReturnType>(
    url: string,
    id: string | number
  ): Promise<ReturnType> => client.delete<ReturnType>(`${url}/${id}`)

  return { getAll, get, create, update, patch, remove }
}

/**
 * Instância única, compartilhada por todo domain service — evita cada
 * `*.service.ts` criar seu próprio `HttpClient` (e, com ele, seu próprio
 * client `ky`) por baixo. Testes mockam o módulo inteiro (`vi.mock`) em vez
 * de injetar client — `HttpFactory` não precisa ser exportada pra isso.
 */
export const api = HttpFactory()
