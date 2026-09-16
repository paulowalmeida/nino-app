import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'

export const useCounterAddressSearch = (street: string, state: string) => {
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
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
  }
}
