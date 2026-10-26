import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

export const addressSaveRequest = (address: Address): SaveAddressRequest => ({
  zipCode: address.zipCode,
  street: address.street,
  number: address.number,
  complement: address.complement ?? undefined,
  neighborhood: address.neighborhood,
  city: address.city,
  state: address.state,
})
