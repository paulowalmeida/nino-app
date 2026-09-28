import type {
  HttpClient,
  HttpRequestOptions,
  HttpSearchParams,
} from '../types/http/http-client'

export const createApi = (client: HttpClient) => ({
  get: <ReturnType>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<ReturnType> =>
    options ? client.get(url, options) : client.get(url),

  getBlob: (url: string): Promise<Blob> => client.getBlob(url),

  getAll: <ReturnType>(
    url: string,
    searchParams: HttpSearchParams
  ): Promise<ReturnType> => client.get(url, { searchParams }),

  create: <BodyType, ReturnType>(
    url: string,
    body?: BodyType,
    options?: HttpRequestOptions
  ): Promise<ReturnType> =>
    options ? client.post(url, body, options) : client.post(url, body),

  createFormData: <ReturnType>(
    url: string,
    body: FormData
  ): Promise<ReturnType> => client.postFormData(url, body),

  update: <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => client.put(url, body),

  patch: <BodyType, ReturnType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => client.patch(url, body),

  remove: <ReturnType, BodyType = unknown>(
    url: string,
    body?: BodyType
  ): Promise<ReturnType> => client.delete(url, body),
})
