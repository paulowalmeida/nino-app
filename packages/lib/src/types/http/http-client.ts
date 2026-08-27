export type HttpSearchParams = Record<string, string | number | boolean>

export type HttpClient = {
  get: <ReturnType>(
    url: string,
    options?: { searchParams?: HttpSearchParams }
  ) => Promise<ReturnType>
  post: <ReturnType, BodyType = unknown>(
    url: string,
    body?: BodyType
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
