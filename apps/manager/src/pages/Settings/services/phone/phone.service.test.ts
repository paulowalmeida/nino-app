import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { PhoneService } from './phone.service'
import {
  phoneIdMock,
  phoneMock,
  phonePageMock,
  removePhoneMessageMock,
  tenantIdMock,
} from './phone.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('PhoneService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listPhones: reads the tenant phones', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(phonePageMock)

    // Act
    const result = await PhoneService.listPhones(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`tenants/${tenantIdMock}/phones`)
    expect(result).toBe(phonePageMock)
  })

  it('createPhone: posts a new phone number', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(phoneMock)

    // Act
    const result = await PhoneService.createPhone(
      tenantIdMock,
      '11999990000'
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/phones`,
      { phone: '11999990000' }
    )
    expect(result).toBe(phoneMock)
  })

  it('updatePhone: patches the phone by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(phoneMock)

    // Act
    const result = await PhoneService.updatePhone(
      tenantIdMock,
      phoneIdMock,
      '11988880000'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/phones/${phoneIdMock}`,
      { phone: '11988880000' }
    )
    expect(result).toBe(phoneMock)
  })

  it('removePhone: deletes the phone by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removePhoneMessageMock)

    // Act
    const result = await PhoneService.removePhone(tenantIdMock, phoneIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/phones/${phoneIdMock}`
    )
    expect(result).toBe(removePhoneMessageMock)
  })
})
