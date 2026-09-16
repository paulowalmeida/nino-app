import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'

export const useCounterAddressSearch = (street: string) => {
  const normalizedStreet = street.trim()
  const [debouncedStreet, setDebouncedStreet] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(street.trim()),
      350
    )
    return () => window.clearTimeout(timer)
  }, [street])

  const query = useQuery({
    queryKey: ['counter', 'address-search', debouncedStreet],
    queryFn: () => CounterAddressSearchService.search(debouncedStreet),
    enabled: debouncedStreet.length >= 3,
    staleTime: 60_000,
  })

  const isWaitingForDebounce =
    normalizedStreet.length >= 3 && normalizedStreet !== debouncedStreet

  return {
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
  }
}
