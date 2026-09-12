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
 * ViaCEP's reverse lookup answers a plain array (empty when nothing matches
 * or the UF is invalid) at /ws/{uf}/{city}/{street}/json/ and matches street
 * as a substring, so a partial street name is enough. It rejects a street
 * shorter than 3 characters with an HTTP 400 HTML page instead of JSON, so
 * that case is guarded before the request is made.
 */
export const searchAddress = async (
  state: string,
  city: string,
  street: string
): Promise<AddressSearchResult[]> => {
  const trimmedStreet = street.trim()
  if (!state || !city || trimmedStreet.length < 3) return []

  const path = [state, city, trimmedStreet]
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  const data = await ky
    .get(`https://viacep.com.br/ws/${path}/json/`)
    .json<ViaCepResponse[]>()
    .catch(() => null)

  return (data ?? []).flatMap((item) => {
    const zipCode = item.cep ?? ''
    if (!zipCode) return []

    return [
      {
        zipCode,
        street: item.logradouro ?? '',
        neighborhood: item.bairro ?? '',
        city: item.localidade ?? '',
        state: item.uf ?? '',
      },
    ]
  })
}
