export type HttpSearchParams = Record<string, string | number | boolean>

/**
 * Métodos HTTP parametrizados e já tipados — resposta chega desempacotada
 * (`Promise<T>`), sem vazar o wrapper de HTTP (ver code-style.md, "Services —
 * nunca vazar o wrapper de HTTP"). Base pra qualquer service, não só pro
 * formato REST-resource do `ApiFactory`.
 */
export type HttpClient = {
  get: <ReturnType>(
    url: string,
    options?: { searchParams?: HttpSearchParams }
  ) => Promise<ReturnType>
  post: <ReturnType, BodyType = unknown>(
    url: string,
    body?: BodyType
  ) => Promise<ReturnType>
  put: <ReturnType, BodyType = unknown>(
    url: string,
    body: BodyType
  ) => Promise<ReturnType>
  patch: <ReturnType, BodyType = unknown>(
    url: string,
    body: BodyType
  ) => Promise<ReturnType>
  delete: <ReturnType>(url: string) => Promise<ReturnType>
}
