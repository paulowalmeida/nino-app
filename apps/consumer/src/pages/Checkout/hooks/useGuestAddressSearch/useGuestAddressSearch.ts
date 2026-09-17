import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/index'

export const useGuestAddressSearch = (
  unitId: string | undefined,
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
    queryKey: ['checkout', 'address-search', unitId, state, debouncedStreet],
    queryFn: () =>
      checkoutAddressSearchService.search(
        unitId as string,
        debouncedStreet,
        state ?? ''
      ),
    enabled:
      !!unitId && state?.length === 2 && debouncedStreet.length >= 3,
    staleTime: 60_000,
  })

  return {
    suggestions: query.data ?? [],
    isSearching:
      (normalizedStreet.length >= 3 && normalizedStreet !== debouncedStreet) ||
      query.isFetching,
  }
}
