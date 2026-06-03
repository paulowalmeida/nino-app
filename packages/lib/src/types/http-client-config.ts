export interface HttpClientConfig {
  baseUrl: string
  getToken?: () => string | null
  onUnauthorized?: () => void
}
