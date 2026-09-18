import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/address-search.service'

export const useGuestAddressSearch = (
  unitId: string | undefined,
  state: string | undefined,
  street: string | undefined
) => {
  const normalizedStreet = street?.trim() ?? ''
  const [debouncedStreet, setDebouncedStreet] = useState('')
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID())

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(normalizedStreet),
      350
    )
    return () => window.clearTimeout(timer)
  }, [normalizedStreet])

  const query = useQuery({
    queryKey: [
      'checkout',
      'address-search',
      unitId,
      state,
      debouncedStreet,
      sessionToken,
    ],
    queryFn: () =>
      checkoutAddressSearchService.search(
        unitId as string,
        debouncedStreet,
        state ?? '',
        sessionToken
      ),
    enabled: !!unitId && state?.length === 2 && debouncedStreet.length >= 3,
    staleTime: 60_000,
  })

  // WORKAROUND: the provider only prices autocomplete for free when a
  // session ends in exactly one details call, so the token must be replaced
  // once the guest confirms a selection — reusing it past that point would
  // mis-attribute the next search to an already-closed session.
  const detailsMutation = useMutation({
    mutationFn: (placeId: string) =>
      checkoutAddressSearchService.details(
        unitId as string,
        placeId,
        sessionToken
      ),
    onSettled: () => setSessionToken(crypto.randomUUID()),
  })

  return {
    suggestions: query.data ?? [],
    isSearching:
      (normalizedStreet.length >= 3 && normalizedStreet !== debouncedStreet) ||
      query.isFetching,
    resolveSelectedAddress: detailsMutation.mutateAsync,
    isResolvingSelectedAddress: detailsMutation.isPending,
  }
}
