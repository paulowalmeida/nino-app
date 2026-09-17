import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { checkoutAddressSearchService } from './address-search.service'
import { checkoutAddressSearchResultsMock } from './address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(checkoutAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('uses the shared address search endpoint with the store coverage', async () => {
    vi.mocked(api.getAll).mockResolvedValue(checkoutAddressSearchResultsMock)

    await expect(
      checkoutAddressSearchService.search('unit-1', 'Rua das', 'PA')
    ).resolves.toEqual(checkoutAddressSearchResultsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: 'unit-1',
      street: 'Rua das',
      state: 'PA',
    })
  })
})
