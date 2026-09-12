import { maskZipCode } from '@nino/ds/masks'
import type { ConsumerAddressRowModel } from '@pages/ConsumerDetail/types/ConsumerAddressRowModel.type'
import type { ConsumerAddress } from '@shared/types/consumer/consumer-address'

const streetLineOf = (address: ConsumerAddress): string =>
  [address.street, address.number].filter(Boolean).join(', ') +
  (address.complement ? ` — ${address.complement}` : '')

const cityLineOf = (address: ConsumerAddress): string =>
  `${address.neighborhood} · ${address.city}/${address.state}` +
  ` · CEP ${maskZipCode(address.zipCode)}`

export const toConsumerAddressRows = (
  addresses: ConsumerAddress[]
): ConsumerAddressRowModel[] =>
  [...addresses]
    .sort((one, other) => Number(other.isPrimary) - Number(one.isPrimary))
    .map((address) => ({
      id: address.id,
      streetLine: streetLineOf(address),
      cityLine: cityLineOf(address),
      isPrimary: Boolean(address.isPrimary),
    }))
