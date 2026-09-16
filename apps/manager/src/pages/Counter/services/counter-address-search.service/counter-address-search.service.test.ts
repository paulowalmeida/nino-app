import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CounterAddressSearchService } from './counter-address-search.service'
import {
  counterAddressSearchParamsMock,
  counterAddressSearchResultsMock,
} from './counter-address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(CounterAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('requests address suggestions from the BFF', async () => {
    vi.mocked(api.getAll).mockResolvedValue(counterAddressSearchResultsMock)

    await expect(
      CounterAddressSearchService.search(counterAddressSearchParamsMock.street)
    ).resolves.toEqual(counterAddressSearchResultsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      street: 'WE-69-A',
    })
  })
})
