import { describe, expect, it, vi } from 'vitest'

import { createApi } from '../../services/http.service'

const buildClient = () => ({
  get: vi.fn().mockResolvedValue({ ok: true }),
  post: vi.fn().mockResolvedValue({ ok: true }),
  postFormData: vi.fn().mockResolvedValue({ ok: true }),
  put: vi.fn().mockResolvedValue({ ok: true }),
  patch: vi.fn().mockResolvedValue({ ok: true }),
  delete: vi.fn().mockResolvedValue({ ok: true }),
})

describe('createApi', () => {
  it('get: forwards the url to client.get', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.get('tenants/1')

    // Assert
    expect(client.get).toHaveBeenCalledWith('tenants/1')
  })

  it('getAll: forwards params as searchParams', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.getAll('tenants/1/orders', { page: 1 })

    // Assert
    expect(client.get).toHaveBeenCalledWith('tenants/1/orders', {
      searchParams: { page: 1 },
    })
  })

  it('create: forwards the body to client.post as-is', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.create('tenants/1/orders', { total: 10 })

    // Assert
    expect(client.post).toHaveBeenCalledWith('tenants/1/orders', {
      total: 10,
    })
  })

  it('createFormData: forwards the form body to client.postFormData', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)
    const body = new FormData()
    body.append('file', new Blob(['image']), 'image.png')

    // Act
    await api.createFormData('tenants/1/products/1/images', body)

    // Assert
    expect(client.postFormData).toHaveBeenCalledWith(
      'tenants/1/products/1/images',
      body
    )
  })

  it('update: forwards the url as-is and the body to client.put', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.update('tenants/1', { name: 'Novo nome' })

    // Assert
    expect(client.put).toHaveBeenCalledWith('tenants/1', {
      name: 'Novo nome',
    })
  })

  it('patch: forwards the url as-is and the body to client.patch', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.patch('tenants/1/staff/user-1', { role: 'STAFF' })

    // Assert
    expect(client.patch).toHaveBeenCalledWith('tenants/1/staff/user-1', {
      role: 'STAFF',
    })
  })

  it('remove: forwards the url as-is to client.delete', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.remove('tenants/1/staff/user-1')

    // Assert
    expect(client.delete).toHaveBeenCalledWith(
      'tenants/1/staff/user-1',
      undefined
    )
  })

  it('remove: forwards the optional body to client.delete', async () => {
    // Arrange
    const client = buildClient()
    const api = createApi(client)

    // Act
    await api.remove('tenants/1/staff/user-1', { reason: 'offboarding' })

    // Assert
    expect(client.delete).toHaveBeenCalledWith('tenants/1/staff/user-1', {
      reason: 'offboarding',
    })
  })

  it('resolves with whatever the underlying client resolves', async () => {
    // Arrange
    const client = buildClient()
    client.get.mockResolvedValueOnce({ id: 'order-1' })
    const api = createApi(client)

    // Act
    const result = await api.get('tenants/1/orders/order-1')

    // Assert
    expect(result).toEqual({ id: 'order-1' })
  })

  it('rejects when the underlying client rejects', async () => {
    // Arrange
    const client = buildClient()
    client.get.mockRejectedValueOnce(new Error('network error'))
    const api = createApi(client)

    // Act / Assert
    await expect(api.get('tenants/1')).rejects.toThrow('network error')
  })
})
