import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  municipalityLocationMock,
  stateLocationMock,
} from './LocationService.mock'
import { LocationService } from './LocationService'

describe('LocationService', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('lists states from IBGE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [stateLocationMock],
      })
    )

    await expect(LocationService.listStates()).resolves.toEqual([
      stateLocationMock,
    ])
  })

  it('lists municipalities for the selected state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [municipalityLocationMock],
      })
    )

    await expect(LocationService.listMunicipalities('PA')).resolves.toEqual([
      municipalityLocationMock,
    ])
  })
})
