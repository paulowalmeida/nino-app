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

const broadAddressResponse = [
  {
    cep: '67033-728',
    logradouro: 'Rua WE-1',
    bairro: 'Aurá',
    localidade: 'Ananindeua',
    uf: 'PA',
  },
  {
    cep: '67033-736',
    logradouro: 'Rua WE-6',
    bairro: 'Aurá',
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

  it('uses a compatible base term and refines numeric suffixes locally', async () => {
    vi.mocked(ky.get).mockReturnValue({
      json: vi.fn().mockResolvedValue(broadAddressResponse),
    } as unknown as ReturnType<typeof ky.get>)

    const result = await searchAddress('PA', 'Ananindeua', 'Rua WE-6')

    expect(ky.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/PA/Ananindeua/Rua%20WE-/json/'
    )
    expect(result).toEqual([
      {
        zipCode: '67033-736',
        street: 'Rua WE-6',
        neighborhood: 'Aurá',
        city: 'Ananindeua',
        state: 'PA',
      },
    ])
  })

  it('matches street terms regardless of their input order', async () => {
    vi.mocked(ky.get).mockReturnValue({
      json: vi.fn().mockResolvedValue(broadAddressResponse),
    } as unknown as ReturnType<typeof ky.get>)

    const result = await searchAddress('PA', 'Ananindeua', 'WE-6 Rua')

    expect(ky.get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/PA/Ananindeua/Rua%20WE-/json/'
    )
    expect(result).toHaveLength(1)
    expect(result[0]?.street).toBe('Rua WE-6')
  })

  it('returns empty when the street has fewer than 3 characters', async () => {
    const result = searchAddress('PA', 'Ananindeua', 'we')

    await expect(result).resolves.toEqual([])
    expect(ky.get).not.toHaveBeenCalled()
  })
})
