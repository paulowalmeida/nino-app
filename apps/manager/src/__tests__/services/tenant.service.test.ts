import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { TenantService } = await import('@services/tenant.service')

describe('TenantService', () => {
  it('createStore: creates a tenant under the company', async () => {
    // Arrange
    const data = {
      slug: 'burgao-centro',
      typeId: 'type-1',
      zipCode: '01001000',
      street: 'Rua Direita',
      number: '100',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    }
    apiMock.create.mockResolvedValueOnce({ id: 'tenant-1', ...data })

    // Act
    const result = await TenantService.createStore(data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith('my/company/tenants', data)
    expect(result).toEqual({ id: 'tenant-1', ...data })
  })

  it('listStoreTypes: reads GET my/company/tenants/types', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce([{ id: 'type-1', name: 'Lanchonete' }])

    // Act
    const result = await TenantService.listStoreTypes()

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('my/company/tenants/types')
    expect(result).toEqual([{ id: 'type-1', name: 'Lanchonete' }])
  })

  it('checkSlug: reads slug availability as a search param', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce({ available: true })

    // Act
    const result = await TenantService.checkSlug('burgao-centro')

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'my/company/tenants/slug-availability',
      { slug: 'burgao-centro' }
    )
    expect(result).toEqual({ available: true })
  })

  it('getById: reads GET tenants/:id', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'tenant-1' })

    // Act
    const result = await TenantService.getById('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1')
    expect(result).toEqual({ id: 'tenant-1' })
  })

  it('updateTenant: patches the tenant by id', async () => {
    // Arrange / Act
    await TenantService.updateTenant('tenant-1', {
      customName: 'Novo nome',
    })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith('tenants', 'tenant-1', {
      customName: 'Novo nome',
    })
  })

  it('getPause: reads GET tenants/:id/pause', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ isPaused: false })

    // Act
    const result = await TenantService.getPause('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/pause')
    expect(result).toEqual({ isPaused: false })
  })

  it('pauseStore: patches the pause sub-resource with the reason', async () => {
    // Arrange / Act
    await TenantService.pauseStore('tenant-1', { reason: 'Fechado hoje' })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants',
      'tenant-1/pause',
      { reason: 'Fechado hoje' }
    )
  })

  it('resumeStore: patches the resume sub-resource with an empty body', async () => {
    // Arrange / Act
    await TenantService.resumeStore('tenant-1')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants',
      'tenant-1/resume',
      {}
    )
  })

  it('removeTenant: removes the tenant by id', async () => {
    // Arrange / Act
    await TenantService.removeTenant('tenant-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith('tenants', 'tenant-1')
  })

  it('setMainTenant: patches the main sub-resource with an empty body', async () => {
    // Arrange / Act
    await TenantService.setMainTenant('tenant-1')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith('tenants', 'tenant-1/main', {})
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(TenantService.getById('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
