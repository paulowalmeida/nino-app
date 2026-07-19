export type HttpClientConfig = {
  baseUrl: string
  onUnauthorized?: () => void
}
