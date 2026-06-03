export type HttpClientConfig = {
  baseUrl: string
  getToken?: () => string | null
  onUnauthorized?: () => void
}
