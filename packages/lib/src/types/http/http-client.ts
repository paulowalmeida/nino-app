export type HttpSearchParams = Record<string, string | number | boolean>

export type HttpRequestOptions = {
  headers?: Record<string, string>
}

export type HttpClient = {
  get: <ReturnType>(
    url: string,
    options?: { searchParams?: HttpSearchParams }
  ) => Promise<ReturnType>
  getBlob: (url: string) => Promise<Blob>
  post: <ReturnType, BodyType = unknown>(
    url: string,
    body?: BodyType,
    options?: HttpRequestOptions
  ) => Promise<ReturnType>
  postFormData: <ReturnType>(url: string, body: FormData) => Promise<ReturnType>
  put: <ReturnType, BodyType = unknown>(
    url: string,
    body: BodyType
  ) => Promise<ReturnType>
  patch: <ReturnType, BodyType = unknown>(
    url: string,
    body: BodyType
  ) => Promise<ReturnType>
  delete: <ReturnType, BodyType = unknown>(
    url: string,
    body?: BodyType
  ) => Promise<ReturnType>
}
