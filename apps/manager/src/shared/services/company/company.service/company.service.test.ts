import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CompanyService } from './company.service'
import { companyMock, updateCompanyRequestMock } from './company.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('CompanyService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getMyCompany: reads my/company', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(companyMock)

    // Act
    const result = await CompanyService.getMyCompany()

    // Assert
    expect(api.get).toHaveBeenCalledWith('my/company')
    expect(result).toBe(companyMock)
  })

  it('updateMyCompany: patches my/company with the given data', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(companyMock)

    // Act
    const result = await CompanyService.updateMyCompany(
      updateCompanyRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      'my/company',
      updateCompanyRequestMock
    )
    expect(result).toBe(companyMock)
  })
})
