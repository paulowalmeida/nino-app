import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { checkoutAddressSearchService } from './address-search.service'
import { checkoutAddressSearchResultsMock } from './address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(checkoutAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('uses the shared address search endpoint with the consumer location', async () => {
    vi.mocked(api.getAll).mockResolvedValue(checkoutAddressSearchResultsMock)

    await expect(
      checkoutAddressSearchService.search('Rua das', 'PA', 'Belém')
    ).resolves.toEqual(checkoutAddressSearchResultsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      street: 'Rua das',
      state: 'PA',
      city: 'Belém',
    })
  })
})
