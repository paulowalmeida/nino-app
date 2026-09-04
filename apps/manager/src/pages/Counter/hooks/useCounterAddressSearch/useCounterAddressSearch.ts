import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { searchAddress } from '@nino/lib/services/zip-code.service'

export const useCounterAddressSearch = (
  city: string,
  state: string,
  street: string
) => {
  const [debouncedStreet, setDebouncedStreet] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(street.trim()),
      350
    )
    return () => window.clearTimeout(timer)
  }, [street])

  const query = useQuery({
    queryKey: ['counter', 'address-search', state, city, debouncedStreet],
    queryFn: () => searchAddress(state, city, debouncedStreet),
    enabled:
      state.length === 2 && city.length > 0 && debouncedStreet.length >= 3,
    staleTime: 60_000,
  })

  return { suggestions: query.data ?? [], isSearching: query.isFetching }
}
