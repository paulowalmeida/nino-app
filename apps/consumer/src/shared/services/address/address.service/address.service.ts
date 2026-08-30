import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { api } from '@shared/services/http/http.service'

/**
 * A agenda de endereços de quem tem conta. Não pagina: uma pessoa tem casa,
 * trabalho e a casa da mãe — e a API devolve a lista inteira por isso.
 */
export const addressService = {
  listMine: (): Promise<Address[]> => api.get<Address[]>('my/addresses'),
  createMine: (data: SaveAddressRequest): Promise<Address> =>
    api.create<SaveAddressRequest, Address>('my/addresses', data),
  updateMine: (id: string, data: SaveAddressRequest): Promise<Address> =>
    api.patch<SaveAddressRequest, Address>(`my/addresses/${id}`, data),
  deleteMine: (id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`my/addresses/${id}`),
}
