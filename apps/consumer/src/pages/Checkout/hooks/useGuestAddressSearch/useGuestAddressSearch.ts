import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/index'

export const useGuestAddressSearch = (
  city: string | undefined,
  state: string | undefined,
  street: string | undefined
) => {
  const normalizedStreet = street?.trim() ?? ''
  const [debouncedStreet, setDebouncedStreet] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(normalizedStreet),
      350
    )
    return () => window.clearTimeout(timer)
  }, [normalizedStreet])

  const query = useQuery({
    queryKey: ['checkout', 'address-search', state, city, debouncedStreet],
    queryFn: () =>
      checkoutAddressSearchService.search(debouncedStreet, state ?? '', city),
    enabled: state?.length === 2 && !!city && debouncedStreet.length >= 3,
    staleTime: 60_000,
  })

  return {
    suggestions: query.data ?? [],
    isSearching:
      (normalizedStreet.length >= 3 && normalizedStreet !== debouncedStreet) ||
      query.isFetching,
  }
}
