import ky from 'ky'

import type {
  AddressLookup,
  AddressSearchResult,
} from '../types/address/address-lookup'

type ViaCepResponse = {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean | string
}

export const onlyDigits = (value: string): string => value.replace(/\D/g, '')

const STREET_TYPE_PATTERN =
  /^(rua|avenida|av|travessa|tv|alameda|estrada|rodovia|praca|beco|largo|passagem|via)$/

const normalizeStreetSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const buildViaCepSearchTerm = (street: string): string => {
  const streetTokens = street.trim().split(/\s+/)
  const streetTypeIndex = streetTokens.findIndex((token) =>
    STREET_TYPE_PATTERN.test(normalizeStreetSearchText(token))
  )
  const orderedTokens =
    streetTypeIndex > 0
      ? [
          streetTokens[streetTypeIndex],
          ...streetTokens.filter((_, index) => index !== streetTypeIndex),
        ]
      : streetTokens

  return orderedTokens
    .map((token) => token.replace(/^(.*?)-\d+$/, '$1-'))
    .join(' ')
}

/**
 * ViaCEP answers 200 with `{ erro: true }` for a well-formed but unknown zip
 * code, so a missing address is a null result rather than a thrown error.
 *
 * Shared by every app that asks for a Brazilian address: the manager, when a
 * store is created, and the storefront, when a consumer saves where to
 * deliver. Same source in both, so the two never disagree about what a zip
 * code means.
 */
export const lookupZipCode = async (
  zipCode: string
): Promise<AddressLookup | null> => {
  const digits = onlyDigits(zipCode)
  if (digits.length !== 8) return null

  const data = await ky
    .get(`https://viacep.com.br/ws/${digits}/json/`)
    .json<ViaCepResponse>()
    .catch(() => null)
  if (!data || data.erro) return null

  return {
    street: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
  }
}

/**
 * CONSTRAINT: ViaCEP's reverse lookup answers a plain array (empty when
 * nothing matches or the UF is invalid) at /ws/{uf}/{city}/{street}/json/.
 * The provider can return an empty result for a more specific numeric suffix,
 * so the request uses a compatible base term and refines the response locally.
 */
export const searchAddress = async (
  state: string,
  city: string,
  street: string
): Promise<AddressSearchResult[]> => {
  const trimmedStreet = street.trim()
  if (!state || !city || trimmedStreet.length < 3) return []

  const viaCepStreet = buildViaCepSearchTerm(trimmedStreet)
  const path = [state, city, viaCepStreet]
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  const data = await ky
    .get(`https://viacep.com.br/ws/${path}/json/`)
    .json<ViaCepResponse[]>()
    .catch(() => null)

  const searchTokens = normalizeStreetSearchText(trimmedStreet).split(' ')

  return (data ?? [])
    .filter((item) => {
      const normalizedLogradouro = normalizeStreetSearchText(
        item.logradouro ?? ''
      )
      return searchTokens.every((token) => normalizedLogradouro.includes(token))
    })
    .flatMap((item) => {
      const zipCode = item.cep ?? ''
      if (!zipCode) return []

      return [
        {
          id: `${zipCode}:${item.logradouro ?? ''}`,
          zipCode,
          street: item.logradouro ?? '',
          neighborhood: item.bairro ?? '',
          city: item.localidade ?? '',
          state: item.uf ?? '',
        },
      ]
    })
}
