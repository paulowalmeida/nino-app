import { describe, expect, it, vi } from 'vitest'

const client = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue({ ok: true }),
  post: vi.fn().mockResolvedValue({ ok: true }),
  put: vi.fn().mockResolvedValue({ ok: true }),
  patch: vi.fn().mockResolvedValue({ ok: true }),
  delete: vi.fn().mockResolvedValue({ ok: true }),
}))

vi.mock('@lib/http-client', () => ({
  createHttpClient: () => client,
}))

const { api } = await import('@services/http.service')

describe('http.service', () => {
  it('get: forwards the url to client.get', async () => {
    // Arrange / Act
    await api.get('tenants/1')

    // Assert
    expect(client.get).toHaveBeenCalledWith('tenants/1')
  })

  it('getAll: forwards params as searchParams', async () => {
    // Arrange / Act
    await api.getAll('tenants/1/orders', { page: 1 })

    // Assert
    expect(client.get).toHaveBeenCalledWith('tenants/1/orders', {
      searchParams: { page: 1 },
    })
  })

  it('create: forwards the body to client.post as-is', async () => {
    // Arrange / Act
    await api.create('tenants/1/orders', { total: 10 })

    // Assert
    expect(client.post).toHaveBeenCalledWith('tenants/1/orders', {
      total: 10,
    })
  })

  it('update: appends the id to the url and forwards the body to client.put', async () => {
    // Arrange / Act
    await api.update('tenants', '1', { name: 'Novo nome' })

    // Assert
    expect(client.put).toHaveBeenCalledWith('tenants/1', {
      name: 'Novo nome',
    })
  })

  it('patch: appends the id to the url and forwards the body to client.patch', async () => {
    // Arrange / Act
    await api.patch('tenants/1/staff', 'user-1', { role: 'STAFF' })

    // Assert
    expect(client.patch).toHaveBeenCalledWith('tenants/1/staff/user-1', {
      role: 'STAFF',
    })
  })

  it('remove: appends the id to the url and calls client.delete', async () => {
    // Arrange / Act
    await api.remove('tenants/1/staff', 'user-1')

    // Assert
    expect(client.delete).toHaveBeenCalledWith('tenants/1/staff/user-1')
  })

  it('resolves with whatever the underlying client resolves', async () => {
    // Arrange
    client.get.mockResolvedValueOnce({ id: 'order-1' })

    // Act
    const result = await api.get('tenants/1/orders/order-1')

    // Assert
    expect(result).toEqual({ id: 'order-1' })
  })

  it('rejects when the underlying client rejects', async () => {
    // Arrange
    client.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(api.get('tenants/1')).rejects.toThrow('network error')
  })
})
