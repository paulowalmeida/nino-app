import ky from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { searchAddress } from '../../services/zip-code.service'

vi.mock('ky', () => ({
  default: { get: vi.fn() },
}))

const addressResponse = [
  {
    cep: '67140-650',
    logradouro: 'Travessa WE-69',
    bairro: 'Coqueiro',
    localidade: 'Ananindeua',
    uf: 'PA',
  },
]

describe('searchAddress', () => {
  beforeEach(() => {
    vi.mocked(ky.get).mockReset()
    vi.mocked(ky.get).mockReturnValue({
      json: vi.fn().mockResolvedValue(addressResponse),
    } as unknown as ReturnType<typeof ky.get>)
  })

  it('queries the ViaCEP reverse lookup with the encoded path', async () => {
    await searchAddress('PA', 'Ananindeua', 'WE 69')

    const expectedUrl = 'https://viacep.com.br/ws/PA/Ananindeua/WE%2069/json/'
    expect(ky.get).toHaveBeenCalledWith(expectedUrl)
  })

  it('returns the matched address results', async () => {
    const result = searchAddress('PA', 'Ananindeua', 'WE 69')

    await expect(result).resolves.toEqual([
      {
        zipCode: '67140-650',
        street: 'Travessa WE-69',
        neighborhood: 'Coqueiro',
        city: 'Ananindeua',
        state: 'PA',
      },
    ])
  })

  it('returns empty when the street has fewer than 3 characters', async () => {
    const result = searchAddress('PA', 'Ananindeua', 'we')

    await expect(result).resolves.toEqual([])
    expect(ky.get).not.toHaveBeenCalled()
  })
})
