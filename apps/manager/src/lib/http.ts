import type { HttpClientConfig } from "@nino/lib"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

export function httpConfig(getToken?: () => string | null): HttpClientConfig {
  return { baseUrl, getToken }
}
