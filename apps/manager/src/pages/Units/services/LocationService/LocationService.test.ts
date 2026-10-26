import { afterEach, describe, expect, it, vi } from 'vitest'

import { LocationService } from './LocationService'
import {
  municipalityLocationMock,
  stateLocationMock,
} from './LocationService.mock'

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

  it('says so when IBGE refuses the states', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(LocationService.listStates()).rejects.toThrow(
      'Não foi possível carregar os estados'
    )
  })

  it('says so when IBGE refuses the cities', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(LocationService.listMunicipalities('PA')).rejects.toThrow(
      'Não foi possível carregar as cidades'
    )
  })
})
