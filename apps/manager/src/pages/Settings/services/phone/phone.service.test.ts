import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { PhoneService } from './phone.service'
import {
  phoneIdMock,
  phoneMock,
  phonePageMock,
  removePhoneMessageMock,
  unitIdMock,
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

  it('listPhones: reads the unit phones', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(phonePageMock)

    // Act
    const result = await PhoneService.listPhones(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/phones`)
    expect(result).toBe(phonePageMock)
  })

  it('createPhone: posts a new phone number', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(phoneMock)

    // Act
    const result = await PhoneService.createPhone(unitIdMock, '11999990000')

    // Assert
    expect(api.create).toHaveBeenCalledWith(`units/${unitIdMock}/phones`, {
      phone: '11999990000',
    })
    expect(result).toBe(phoneMock)
  })

  it('updatePhone: patches the phone by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(phoneMock)

    // Act
    const result = await PhoneService.updatePhone(
      unitIdMock,
      phoneIdMock,
      '11988880000'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/phones/${phoneIdMock}`,
      { phone: '11988880000' }
    )
    expect(result).toBe(phoneMock)
  })

  it('removePhone: deletes the phone by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removePhoneMessageMock)

    // Act
    const result = await PhoneService.removePhone(unitIdMock, phoneIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/phones/${phoneIdMock}`
    )
    expect(result).toBe(removePhoneMessageMock)
  })
})
