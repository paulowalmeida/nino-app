import type { AddressLookup } from '../types/address/address-lookup'

type ViaCepResponse = {
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
 * store is created, and the storefront, when a customer saves where to
 * deliver. Same source in both, so the two never disagree about what a zip
 * code means.
 */
export const lookupZipCode = async (
  zipCode: string
): Promise<AddressLookup | null> => {
  const digits = onlyDigits(zipCode)
  if (digits.length !== 8) return null

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
  if (!response.ok) return null

  const data = (await response.json()) as ViaCepResponse
  if (data.erro) return null

  return {
    street: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
  }
}
