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
      CounterAddressSearchService.search(
        counterAddressSearchParamsMock.unitId,
        counterAddressSearchParamsMock.street,
        counterAddressSearchParamsMock.state
      )
    ).resolves.toEqual(counterAddressSearchResultsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: counterAddressSearchParamsMock.unitId,
      street: 'WE-69-A',
      state: 'PA',
    })
  })

  it('passes the active unit and state to the BFF', async () => {
    vi.mocked(api.getAll).mockResolvedValue(counterAddressSearchResultsMock)

    await CounterAddressSearchService.search('unit-1', 'Avenida Nazaré', 'PA')

    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: 'unit-1',
      street: 'Avenida Nazaré',
      state: 'PA',
    })
  })
})
