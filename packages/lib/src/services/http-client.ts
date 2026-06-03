import { HttpClientConfig } from '../types/http-client-config'
import { HttpMethod } from '../types/http-method'

function buildHeaders(config: HttpClientConfig): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = config.getToken?.()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function toApiError(response: Response): Promise<Error> {
  const error = await response.json().catch(() => ({}))
  return new Error(error.message ?? response.statusText)
}

async function assertOk(response: Response, config: HttpClientConfig): Promise<void> {
  if (response.status === 401) {
    config.onUnauthorized?.()
    throw new Error('Unauthorized')
  }
  if (!response.ok) throw await toApiError(response)
}

async function request<T>(
  method: HttpMethod,
  path: string,
  config: HttpClientConfig,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers: buildHeaders(config),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  await assertOk(response, config)

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export function get<T>(config: HttpClientConfig, path: string): Promise<T> {
  return request('GET', path, config)
}

export function post<T>(config: HttpClientConfig, path: string, body?: unknown): Promise<T> {
  return request('POST', path, config, body)
}

export function put<T>(config: HttpClientConfig, path: string, body?: unknown): Promise<T> {
  return request('PUT', path, config, body)
}

export function patch<T>(config: HttpClientConfig, path: string, body?: unknown): Promise<T> {
  return request('PATCH', path, config, body)
}

export function del<T>(config: HttpClientConfig, path: string): Promise<T> {
  return request('DELETE', path, config)
}
