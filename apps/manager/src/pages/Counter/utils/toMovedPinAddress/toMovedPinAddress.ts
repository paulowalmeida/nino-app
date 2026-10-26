import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

const toComparableStreet = (street: string) =>
  street
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export const toMovedPinAddress = (
  previousAddress: AddressSearchResult,
  addressAtPin: AddressSearchResult
): AddressSearchResult => {
  const isSameStreet =
    toComparableStreet(previousAddress.street) ===
    toComparableStreet(addressAtPin.street)
  const keptNumber = isSameStreet ? previousAddress.number : ''

  return { ...addressAtPin, number: addressAtPin.number || keptNumber }
}
