import { maskZipCode } from '@nino/ds/masks'
import type { CustomerAddressRowModel } from '@pages/CustomerDetail/types/CustomerAddressRowModel.type'
import type { CustomerAddress } from '@shared/types/customer/customer-address'

const streetLineOf = (address: CustomerAddress): string =>
  [address.street, address.number].filter(Boolean).join(', ') +
  (address.complement ? ` — ${address.complement}` : '')

const cityLineOf = (address: CustomerAddress): string =>
  `${address.neighborhood} · ${address.city}/${address.state}` +
  ` · CEP ${maskZipCode(address.zipCode)}`

export const toCustomerAddressRows = (
  addresses: CustomerAddress[]
): CustomerAddressRowModel[] =>
  [...addresses]
    .sort((one, other) => Number(other.isPrimary) - Number(one.isPrimary))
    .map((address) => ({
      id: address.id,
      streetLine: streetLineOf(address),
      cityLine: cityLineOf(address),
      isPrimary: Boolean(address.isPrimary),
    }))
