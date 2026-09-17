import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'
import type { DeliveryCity } from '@shared/types/store/delivery-city'

const normalizeLocation = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleUpperCase('pt-BR')

const isAllowedDeliveryCity = (
  suggestion: AddressSearchResult,
  deliveryCities: DeliveryCity[]
): boolean =>
  deliveryCities.length === 0 ||
  deliveryCities.some(
    (deliveryCity) =>
      normalizeLocation(deliveryCity.city) === normalizeLocation(suggestion.city) &&
      normalizeLocation(deliveryCity.state) === normalizeLocation(suggestion.state)
  )

export const useCounterAddressSearch = (
  street: string,
  state: string,
  deliveryCities: DeliveryCity[] = []
) => {
  const normalizedStreet = street.trim()
  const normalizedState = state.trim().toUpperCase()
  const [debouncedStreet, setDebouncedStreet] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(street.trim()),
      600
    )
    return () => window.clearTimeout(timer)
  }, [street])

  const query = useQuery({
    queryKey: [
      'counter',
      'address-search',
      debouncedStreet,
      normalizedState,
      deliveryCities,
    ],
    queryFn: () =>
      CounterAddressSearchService.search(debouncedStreet, normalizedState),
    enabled: debouncedStreet.length >= 3 && normalizedState.length === 2,
    staleTime: 60_000,
    retry: false,
  })

  const isWaitingForDebounce =
    normalizedStreet.length >= 3 &&
    normalizedState.length === 2 &&
    normalizedStreet !== debouncedStreet

  return {
    suggestions: (query.data ?? []).filter((suggestion) =>
      isAllowedDeliveryCity(suggestion, deliveryCities)
    ),
    isSearching: isWaitingForDebounce || query.isFetching,
  }
}
