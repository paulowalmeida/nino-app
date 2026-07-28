import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { del, get, patch, post } from '@services/api/api.service'

/**
 * A agenda de endereços de quem tem conta. Não pagina: uma pessoa tem casa,
 * trabalho e a casa da mãe — e a API devolve a lista inteira por isso.
 */
export const listMyAddresses = (): Promise<Address[]> =>
  get<Address[]>('my/addresses')

export const createMyAddress = (data: SaveAddressRequest): Promise<Address> =>
  post<SaveAddressRequest, Address>('my/addresses', data)

export const updateMyAddress = (
  id: string,
  data: SaveAddressRequest
): Promise<Address> =>
  patch<SaveAddressRequest, Address>(`my/addresses/${id}`, data)

export const deleteMyAddress = (id: string): Promise<{ message: string }> =>
  del<{ message: string }>(`my/addresses/${id}`)
