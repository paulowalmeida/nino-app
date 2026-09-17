import ky from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { lookupZipCode } from '../../services/zip-code.service'

vi.mock('ky', () => ({
  default: { get: vi.fn() },
}))

describe('lookupZipCode', () => {
  beforeEach(() => {
    vi.mocked(ky.get).mockReset()
    vi.mocked(ky.get).mockReturnValue({
      json: vi.fn().mockResolvedValue({
        cep: '66000-000',
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        localidade: 'Belém',
        uf: 'PA',
      }),
    } as unknown as ReturnType<typeof ky.get>)
  })

  it('queries ViaCEP only for an eight-digit zip code', async () => {
    await lookupZipCode('66000-000')

    const expectedUrl = 'https://viacep.com.br/ws/66000000/json/'
    expect(ky.get).toHaveBeenCalledWith(expectedUrl)
  })

  it('maps the ViaCEP address fields', async () => {
    await expect(lookupZipCode('66000-000')).resolves.toEqual({
      street: 'Rua das Flores',
      neighborhood: 'Centro',
      city: 'Belém',
      state: 'PA',
    })
  })

  it('does not call ViaCEP before eight digits', async () => {
    await expect(lookupZipCode('66000-00')).resolves.toBeNull()
    expect(ky.get).not.toHaveBeenCalled()
  })
})
