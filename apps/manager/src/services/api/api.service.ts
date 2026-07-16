import ky, { HTTPError, TimeoutError, type ResponsePromise } from 'ky'

import type { ApiFactoryParams } from '@app-types/http/api-factory-params.type'
import { HTTP_ERRORS } from '@constants/http.constants'
import type { ApiFactoryType } from '@app-types/api/api.type'

const handleError = (error: unknown): never => {
  if (error instanceof HTTPError) {
    const message = HTTP_ERRORS[error.response.status] ?? error.message
    throw new Error(`HTTP ${error.response.status}: ${message}`)
  }
  if (error instanceof TimeoutError) {
    throw new Error('Request timed out')
  }
  throw error
}

const BASE_URL = import.meta.env.VITE_BASE_URL

export const ApiFactory = ({
  baseUrl = BASE_URL,
}: ApiFactoryParams = {}): ApiFactoryType => {
  const client = ky.create({
    prefix: baseUrl,
    credentials: 'include',
  })

  const execute = <T>(request: ResponsePromise): Promise<T> =>
    request.json<T>().catch(handleError)

  const getAll = <
    ParamsType extends Record<string, string | number | boolean>,
    ReturnType,
  >(
    url: string,
    params: ParamsType
  ): Promise<ReturnType> => {
    return execute<ReturnType>(client.get(url, { searchParams: params }))
  }

  const get = <ReturnType>(
    url: string,
    id?: string | number
  ): Promise<ReturnType> => {
    const param = id ? `/${id}` : ''
    return execute<ReturnType>(client.get(`${url}${param}`))
  }

  const create = <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => {
    return execute<ReturnType>(client.post(url, { json: body }))
  }

  const update = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> => {
    return execute<ReturnType>(client.put(`${url}/${id}`, { json: body }))
  }

  const patch = <BodyType, ReturnType>(
    url: string,
    id: string | number,
    body: BodyType
  ): Promise<ReturnType> => {
    return execute<ReturnType>(client.patch(`${url}/${id}`, { json: body }))
  }

  const remove = <ReturnType>(
    url: string,
    id: string | number
  ): Promise<ReturnType> => {
    return execute<ReturnType>(client.delete(`${url}/${id}`))
  }

  return {
    getAll,
    get,
    create,
    update,
    patch,
    remove,
  }
}
