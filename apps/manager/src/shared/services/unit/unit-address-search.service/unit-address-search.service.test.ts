import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { UnitAddressSearchService } from './unit-address-search.service'
import {
  unitAddressPredictionMock,
  unitAddressSearchResultMock,
} from './unit-address-search.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { getAll: vi.fn() },
}))

describe(UnitAddressSearchService.search.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('requests unit address predictions with the city context', async () => {
    const predictions = [unitAddressPredictionMock]
    vi.mocked(api.getAll).mockResolvedValue(predictions)

    await expect(
      UnitAddressSearchService.search(
        'unit-1',
        'Rua das Flores',
        'PA',
        'session-1',
        'Belém'
      )
    ).resolves.toEqual(predictions)

    expect(api.getAll).toHaveBeenCalledWith('addresses/unit/search', {
      unitId: 'unit-1',
      street: 'Rua das Flores',
      state: 'PA',
      sessionToken: 'session-1',
      city: 'Belém',
    })
  })
})

describe('UnitAddressSearchService without a store yet', () => {
  afterEach(() => vi.clearAllMocks())

  it('searches and resolves without sending a unit id', async () => {
    vi.mocked(api.getAll).mockResolvedValue([])

    await UnitAddressSearchService.search(
      null,
      'Rua das Flores',
      'PA',
      'session-1',
      'Belém'
    )
    await UnitAddressSearchService.details(null, 'place-1', 'session-1')

    expect(api.getAll).toHaveBeenNthCalledWith(1, 'addresses/unit/search', {
      street: 'Rua das Flores',
      state: 'PA',
      sessionToken: 'session-1',
      city: 'Belém',
    })
    expect(api.getAll).toHaveBeenNthCalledWith(
      2,
      'addresses/unit/place-1/details',
      { sessionToken: 'session-1' }
    )
  })
})

describe(UnitAddressSearchService.details.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('resolves the selected unit address through the dedicated endpoint', async () => {
    vi.mocked(api.getAll).mockResolvedValue(unitAddressSearchResultMock)

    await expect(
      UnitAddressSearchService.details('unit-1', 'place-1', 'session-1')
    ).resolves.toEqual(unitAddressSearchResultMock)

    expect(api.getAll).toHaveBeenCalledWith('addresses/unit/place-1/details', {
      unitId: 'unit-1',
      sessionToken: 'session-1',
    })
  })
})
