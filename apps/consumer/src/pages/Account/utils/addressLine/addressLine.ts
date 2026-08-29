import type { Address } from '@custom_types/address/address'

export const addressStreetLine = ({
  street,
  number,
  complement,
}: Address): string =>
  [`${street}, ${number}`, complement].filter(Boolean).join(' · ')

export const addressCityLine = ({
  neighborhood,
  city,
  state,
  zipCode,
}: Address): string => `${neighborhood} · ${city}/${state} · ${zipCode}`
