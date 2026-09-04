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

type CepRuaAddress = {
  cep?: string
  logradouro?: string
  nome?: string
  bairro?: string
  cidade?: string
  uf?: string
}

type CepRuaSearchResponse = {
  resultados?: CepRuaAddress[]
}

const comparable = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')

const addressSearchQuery = (street: string): string =>
  street.trim().replace(/([A-Za-zÀ-ÿ])\s+(\d)/g, '$1-$2')

export const onlyDigits = (value: string): string => value.replace(/\D/g, '')

/**
 * ViaCEP answers 200 with `{ erro: true }` for a well-formed but unknown zip
 * code, so a missing address is a null result rather than a thrown error.
 *
 * Shared by every app that asks for a Brazilian address: the manager, when a
 * store is created, and the storefront, when a customer saves where to
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

export const searchAddress = async (
  state: string,
  city: string,
  street: string
): Promise<AddressSearchResult[]> => {
  if (!state || !city || street.trim().length < 3) return []

  const query = addressSearchQuery(street)
  const data = await ky
    .get('https://ceprua.com.br/api/buscar', { searchParams: { q: query } })
    .json<CepRuaSearchResponse>()
    .catch(() => null)

  const seen = new Set<string>()
  return (data?.resultados ?? []).flatMap((item) => {
    const zipCode = item.cep ?? ''
    const resultCity = item.cidade ?? ''
    const resultState = item.uf ?? ''

    if (
      !zipCode ||
      seen.has(zipCode) ||
      comparable(resultCity) !== comparable(city) ||
      resultState !== state.toUpperCase()
    ) {
      return []
    }

    seen.add(zipCode)
    return [
      {
        zipCode,
        street: item.logradouro ?? item.nome ?? '',
        neighborhood: item.bairro ?? '',
        city: resultCity,
        state: resultState,
      },
    ]
  })
}
