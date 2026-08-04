import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { CompanyService } = await import('@services/company.service')

describe('CompanyService', () => {
  it('getMyCompany: reads GET my/company', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'c1', name: 'Burgão do Nino' })

    // Act
    const result = await CompanyService.getMyCompany()

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('my/company')
    expect(result).toEqual({ id: 'c1', name: 'Burgão do Nino' })
  })

  it('updateMyCompany: patches my/company with the given data', async () => {
    // Arrange / Act
    await CompanyService.updateMyCompany({ name: 'Novo nome' })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith('my', 'company', {
      name: 'Novo nome',
    })
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(CompanyService.getMyCompany()).rejects.toThrow(
      'network error'
    )
  })
})
