import ky from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { searchAddress } from '../../services/zip-code.service'

vi.mock('ky', () => ({
  default: { get: vi.fn() },
}))

const addressResponse = {
  resultados: [
    {
      cep: '67140-650',
      nome: 'Travessa WE-69',
      bairro: 'Coqueiro',
      cidade: 'Ananindeua',
      uf: 'PA',
    },
  ],
}

describe('searchAddress', () => {
  beforeEach(() => {
    vi.mocked(ky.get).mockReset()
    vi.mocked(ky.get).mockReturnValue({
      json: vi.fn().mockResolvedValue(addressResponse),
    } as never)
  })

  it('normalizes street codes for the textual-search provider', async () => {
    await searchAddress('PA', 'Ananindeua', 'WE 69')

    expect(ky.get).toHaveBeenCalledWith('https://ceprua.com.br/api/buscar', {
      searchParams: { q: 'WE-69' },
    })
  })

  it('returns only results for the delivery city', async () => {
    await expect(searchAddress('PA', 'Ananindeua', 'WE 69')).resolves.toEqual([
      {
        zipCode: '67140-650',
        street: 'Travessa WE-69',
        neighborhood: 'Coqueiro',
        city: 'Ananindeua',
        state: 'PA',
      },
    ])
  })
})
