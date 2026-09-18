import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { checkoutAddressSearchService } from './address-search.service'
import {
  checkoutAddressPredictionsMock,
  checkoutAddressSearchResultMock,
} from './address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(checkoutAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('requests predictions with a session token scoped to the store coverage', async () => {
    vi.mocked(api.getAll).mockResolvedValue(checkoutAddressPredictionsMock)

    await expect(
      checkoutAddressSearchService.search(
        'unit-1',
        'Rua das',
        'PA',
        'session-1'
      )
    ).resolves.toEqual(checkoutAddressPredictionsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: 'unit-1',
      street: 'Rua das',
      state: 'PA',
      sessionToken: 'session-1',
    })
  })
})

describe(checkoutAddressSearchService.details.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('resolves one selected place into the full address, closing the session', async () => {
    vi.mocked(api.getAll).mockResolvedValue(checkoutAddressSearchResultMock)

    await expect(
      checkoutAddressSearchService.details('unit-1', 'place-1', 'session-1')
    ).resolves.toEqual(checkoutAddressSearchResultMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/place-1/details', {
      unitId: 'unit-1',
      sessionToken: 'session-1',
    })
  })
})
