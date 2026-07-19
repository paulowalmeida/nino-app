import type { HttpClientConfig } from "@nino/lib"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

export function httpConfig(): HttpClientConfig {
  return { baseUrl }
}
