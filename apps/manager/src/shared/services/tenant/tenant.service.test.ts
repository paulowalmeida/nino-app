import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { TenantService } from './tenant.service'
import {
  createdStoreMock,
  createStoreRequestMock,
  pauseRequestMock,
  removeTenantMessageMock,
  slugAvailabilityMock,
  storeTypeOptionsMock,
  tenantDetailMock,
  tenantIdMock,
  tenantPauseMock,
  updateTenantRequestMock,
} from './tenant.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('TenantService', () => {
  afterEach(() => vi.clearAllMocks())

  it('createStore: posts a new store for the company', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(createdStoreMock)

    // Act
    const result = await TenantService.createStore(createStoreRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      'my/company/tenants',
      createStoreRequestMock
    )
    expect(result).toBe(createdStoreMock)
  })

  it('listStoreTypes: reads the available store types', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(storeTypeOptionsMock)

    // Act
    const result = await TenantService.listStoreTypes()

    // Assert
    expect(api.get).toHaveBeenCalledWith('my/company/tenants/types')
    expect(result).toBe(storeTypeOptionsMock)
  })

  it('checkSlug: reads slug availability', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(slugAvailabilityMock)

    // Act
    const result = await TenantService.checkSlug('padoca-do-bairro')

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      'my/company/tenants/slug-availability',
      { slug: 'padoca-do-bairro' }
    )
    expect(result).toBe(slugAvailabilityMock)
  })

  it('getById: reads a tenant by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(tenantDetailMock)

    // Act
    const result = await TenantService.getById(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`tenants/${tenantIdMock}`)
    expect(result).toBe(tenantDetailMock)
  })

  it('updateTenant: patches the tenant by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(tenantDetailMock)

    // Act
    const result = await TenantService.updateTenant(
      tenantIdMock,
      updateTenantRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}`,
      updateTenantRequestMock
    )
    expect(result).toBe(tenantDetailMock)
  })

  it('getPause: reads the tenant pause status', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(tenantPauseMock)

    // Act
    const result = await TenantService.getPause(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`tenants/${tenantIdMock}/pause`)
    expect(result).toBe(tenantPauseMock)
  })

  it('pauseStore: patches the tenant pause with a reason', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(tenantPauseMock)

    // Act
    const result = await TenantService.pauseStore(
      tenantIdMock,
      pauseRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/pause`,
      pauseRequestMock
    )
    expect(result).toBe(tenantPauseMock)
  })

  it('resumeStore: patches the tenant back to active', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(tenantPauseMock)

    // Act
    const result = await TenantService.resumeStore(tenantIdMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/resume`,
      {}
    )
    expect(result).toBe(tenantPauseMock)
  })

  it('removeTenant: deletes the tenant by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeTenantMessageMock)

    // Act
    const result = await TenantService.removeTenant(tenantIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(`tenants/${tenantIdMock}`)
    expect(result).toBe(removeTenantMessageMock)
  })

  it('setMainTenant: patches the tenant as the main store', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(tenantDetailMock)

    // Act
    const result = await TenantService.setMainTenant(tenantIdMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/main`,
      {}
    )
    expect(result).toBe(tenantDetailMock)
  })
})
