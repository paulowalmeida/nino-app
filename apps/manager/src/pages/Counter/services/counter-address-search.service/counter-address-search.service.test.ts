import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CounterAddressSearchService } from './counter-address-search.service'
import {
  counterAddressPredictionsMock,
  counterAddressSearchParamsMock,
  counterAddressSearchResultMock,
} from './counter-address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(CounterAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('requests address predictions from the BFF with a session token', async () => {
    vi.mocked(api.getAll).mockResolvedValue(counterAddressPredictionsMock)

    await expect(
      CounterAddressSearchService.search(
        counterAddressSearchParamsMock.unitId,
        counterAddressSearchParamsMock.street,
        counterAddressSearchParamsMock.state,
        counterAddressSearchParamsMock.sessionToken
      )
    ).resolves.toEqual(counterAddressPredictionsMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: counterAddressSearchParamsMock.unitId,
      street: 'WE-69-A',
      state: 'PA',
      sessionToken: counterAddressSearchParamsMock.sessionToken,
    })
  })

  it('passes the active unit, state and session token to the BFF', async () => {
    vi.mocked(api.getAll).mockResolvedValue(counterAddressPredictionsMock)

    await CounterAddressSearchService.search(
      'unit-1',
      'Avenida Nazaré',
      'PA',
      'session-2'
    )

    expect(api.getAll).toHaveBeenCalledWith('addresses/search', {
      unitId: 'unit-1',
      street: 'Avenida Nazaré',
      state: 'PA',
      sessionToken: 'session-2',
    })
  })
})

describe(CounterAddressSearchService.details.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('resolves one selected place into the full address, closing the session', async () => {
    vi.mocked(api.getAll).mockResolvedValue(counterAddressSearchResultMock)

    await expect(
      CounterAddressSearchService.details(
        counterAddressSearchParamsMock.unitId,
        'place-we69a',
        counterAddressSearchParamsMock.sessionToken
      )
    ).resolves.toEqual(counterAddressSearchResultMock)
    expect(api.getAll).toHaveBeenCalledWith('addresses/place-we69a/details', {
      unitId: counterAddressSearchParamsMock.unitId,
      sessionToken: counterAddressSearchParamsMock.sessionToken,
    })
  })
})
