import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createHttpClient } from '../../lib/http-client'

const BASE_URL = 'https://api.test'
const HINT_KEY = 'had-session'

const baseConfig = () => ({
  baseUrl: BASE_URL,
  refreshPath: 'auth/refresh',
  exemptPaths: ['auth/login', 'auth/signup', 'auth/refresh'],
  sessionProbePath: 'auth/me',
  hasPriorSession: () => window.localStorage.getItem(HINT_KEY) === '1',
  onUnrecoverable: vi.fn(),
  httpErrorLabels: { 500: 'Internal server error' },
})

const jsonResponse = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const stubFetch = (...responses: Response[]) => {
  const fetchMock = vi.fn()
  for (const response of responses) fetchMock.mockResolvedValueOnce(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const signedIn = () => window.localStorage.setItem(HINT_KEY, '1')

const requestOf = (fetchMock: ReturnType<typeof vi.fn>, call = 0): Request =>
  fetchMock.mock.calls[call][0] as Request

const expectApiError = (error: unknown, status: number, message: string) => {
  expect(error).toBeInstanceOf(Error)
  expect((error as { status: unknown }).status).toBe(status)
  expect((error as Error).message).toBe(message)
}

describe('createHttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('get: returns the parsed body directly, unwrapped', async () => {
    // Arrange
    stubFetch(jsonResponse(200, { id: 'order-1' }))
    const client = createHttpClient(baseConfig())

    // Act
    const result = await client.get('orders/order-1')

    // Assert
    expect(result).toEqual({ id: 'order-1' })
  })

  it('get: resolves an empty body as null, instead of failing to parse', async () => {
    // Arrange
    stubFetch(new Response(null, { status: 200 }))
    const client = createHttpClient(baseConfig())

    // Act
    const result = await client.get('cash-sessions/current')

    // Assert
    expect(result).toBeNull()
  })

  it('get: sends custom headers with the request', async () => {
    // Arrange
    const fetchMock = stubFetch(jsonResponse(200, { ok: true }))
    const client = createHttpClient(baseConfig())

    // Act
    await client.get('orders/order-1/status', {
      headers: { 'x-guest-order-token': 'token-1' },
    })

    // Assert
    expect(requestOf(fetchMock).headers.get('x-guest-order-token')).toBe(
      'token-1'
    )
  })

  it('getBlob: resolves the raw response body as a Blob', async () => {
    // Arrange
    const pdf = new Response('%PDF-1.4', {
      status: 200,
      headers: { 'content-type': 'application/pdf' },
    })
    stubFetch(pdf)
    const client = createHttpClient(baseConfig())

    // Act
    const result = await client.getBlob('units/1/orders/order-1/receipt')

    // Assert
    expect(result).toBeInstanceOf(Blob)
    expect(await result.text()).toBe('%PDF-1.4')
  })

  it('getBlob: throws an ApiError when the order has no receipt', async () => {
    // Arrange
    stubFetch(jsonResponse(404, { message: 'Order not found' }))
    const client = createHttpClient(baseConfig())

    // Act
    const error = await client
      .getBlob('units/1/orders/missing/receipt')
      .catch((err) => err)

    // Assert
    expectApiError(error, 404, 'Order not found')
  })

  it('post: sends the body as json and returns the response', async () => {
    // Arrange
    let sentBody = ''
    const fetchMock = vi.fn(async (request: Request) => {
      sentBody = await request.clone().text()
      return jsonResponse(201, { id: 'order-2' })
    })
    vi.stubGlobal('fetch', fetchMock)
    const client = createHttpClient(baseConfig())

    // Act
    const result = await client.post('orders', { total: 42 })

    // Assert
    expect(result).toEqual({ id: 'order-2' })
    expect(JSON.parse(sentBody)).toEqual({ total: 42 })
  })

  it('post: sends custom headers with the request', async () => {
    // Arrange
    const fetchMock = stubFetch(jsonResponse(201, { id: 'order-3' }))
    const client = createHttpClient(baseConfig())

    // Act
    await client.post(
      'orders',
      { total: 42 },
      { headers: { 'Idempotency-Key': 'order-3' } }
    )

    // Assert
    expect(requestOf(fetchMock).headers.get('Idempotency-Key')).toBe('order-3')
  })

  it('postFormData: sends a multipart body and returns the response', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(201, { id: 'image-1' }))
    vi.stubGlobal('fetch', fetchMock)
    const client = createHttpClient(baseConfig())
    const body = new FormData()
    body.append('file', new Blob(['image']), 'image.png')

    // Act
    const result = await client.postFormData('products/1/images', body)

    // Assert
    expect(result).toEqual({ id: 'image-1' })
    const request = requestOf(fetchMock)
    expect(request.method).toBe('POST')
    expect(request.headers.get('content-type')).toMatch(
      /^multipart\/form-data;/
    )
  })

  it('put/patch/delete: hit the matching ky verb', async () => {
    // Arrange
    const fetchMock = stubFetch(
      jsonResponse(200, { ok: true }),
      jsonResponse(200, { ok: true }),
      jsonResponse(200, { ok: true })
    )
    const client = createHttpClient(baseConfig())

    // Act
    await client.put('orders/order-1', { total: 43 })
    await client.patch('orders/order-1', { total: 44 })
    await client.delete('orders/order-1')

    // Assert
    expect(
      fetchMock.mock.calls.map((_, i) => requestOf(fetchMock, i).method)
    ).toEqual(['PUT', 'PATCH', 'DELETE'])
  })

  it('delete: sends a json body when one is given', async () => {
    // Arrange
    let sentBody = ''
    const fetchMock = vi.fn(async (request: Request) => {
      sentBody = await request.clone().text()
      return jsonResponse(200, { count: 2 })
    })
    vi.stubGlobal('fetch', fetchMock)
    const client = createHttpClient(baseConfig())

    // Act
    await client.delete('products/bulk', { ids: ['p1', 'p2'] })

    // Assert
    expect(requestOf(fetchMock).method).toBe('DELETE')
    expect(JSON.parse(sentBody)).toEqual({ ids: ['p1', 'p2'] })
  })

  it('401 with a session hint: refreshes once and retries', async () => {
    // Arrange
    signedIn()
    const config = baseConfig()
    const fetchMock = stubFetch(
      jsonResponse(401, { message: 'Unauthorized' }),
      jsonResponse(200),
      jsonResponse(200, { id: 'order-1' })
    )
    const client = createHttpClient(config)

    // Act
    const result = await client.get('orders/order-1')

    // Assert
    expect(result).toEqual({ id: 'order-1' })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(requestOf(fetchMock, 1).url).toContain('auth/refresh')
    expect(config.onUnrecoverable).not.toHaveBeenCalled()
  })

  it('401 with no prior session: reports it as unrecoverable without a refresh', async () => {
    // Arrange
    const config = baseConfig()
    const fetchMock = stubFetch(jsonResponse(401, { message: 'Unauthorized' }))
    const client = createHttpClient(config)

    // Act
    const error = await client.get('orders/order-1').catch((err) => err)

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(config.onUnrecoverable).toHaveBeenCalledTimes(1)
    expectApiError(error, 401, 'Unauthorized')
  })

  it('401 when the refresh itself fails: reports it as unrecoverable', async () => {
    // Arrange
    signedIn()
    const config = baseConfig()
    const fetchMock = stubFetch(
      jsonResponse(401, { message: 'Unauthorized' }),
      jsonResponse(401)
    )
    const client = createHttpClient(config)

    // Act
    const error = await client.get('orders/order-1').catch((err) => err)

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(config.onUnrecoverable).toHaveBeenCalledTimes(1)
    expectApiError(error, 401, 'Unauthorized')
  })

  it('401 on an exempt path: neither refreshes nor reports unrecoverable', async () => {
    // Arrange
    signedIn()
    const config = baseConfig()
    const fetchMock = stubFetch(
      jsonResponse(401, { message: 'Invalid credentials' })
    )
    const client = createHttpClient(config)

    // Act
    const error = await client
      .post('auth/login', { phone: '11999999999' })
      .catch((err) => err)

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(config.onUnrecoverable).not.toHaveBeenCalled()
    expectApiError(error, 401, 'Invalid credentials')
  })

  it('401 on the session probe: never reports it as unrecoverable', async () => {
    // Arrange
    signedIn()
    const config = baseConfig()
    stubFetch(jsonResponse(401), jsonResponse(401))
    const client = createHttpClient(config)

    // Act
    await client.get('auth/me').catch((err) => err)

    // Assert
    expect(config.onUnrecoverable).not.toHaveBeenCalled()
  })

  it('non-401 error: throws ApiError with the parsed message', async () => {
    // Arrange
    const config = baseConfig()
    stubFetch(jsonResponse(404, { message: 'Order not found' }))
    const client = createHttpClient(config)

    // Act
    const error = await client.get('orders/missing').catch((err) => err)

    // Assert
    expectApiError(error, 404, 'Order not found')
    expect(config.onUnrecoverable).not.toHaveBeenCalled()
  })

  it('error with an array message: joins entries with a comma', async () => {
    // Arrange
    stubFetch(jsonResponse(400, { message: ['name is required', 'bad price'] }))
    const client = createHttpClient(baseConfig())

    // Act
    const error = await client.post('orders', {}).catch((err) => err)

    // Assert
    expectApiError(error, 400, 'name is required, bad price')
  })

  it('unparsable body: falls back to the configured http error label', async () => {
    // Arrange
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('not json', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)
    const client = createHttpClient(baseConfig())

    // Act
    const error = await client.get('orders/order-1').catch((err) => err)

    // Assert
    expectApiError(error, 500, 'Internal server error')
  })

  it('a fetch that never settles: throws a timeout ApiError', async () => {
    // Arrange
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    const client = createHttpClient(baseConfig())

    // Act
    const pending = client.get('orders/order-1').catch((err) => err)
    await vi.advanceTimersByTimeAsync(10_000)
    const error = await pending

    // Assert
    expectApiError(error, 0, 'Request timed out')
  })
})
