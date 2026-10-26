import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { checkoutAddressSearchService } from '@pages/Checkout/services/address-search/address-search.service/address-search.service'

export const useGuestAddressSearch = (
  unitId: string | undefined,
  state: string | undefined,
  street: string,
  number: string,
  searchRequested: boolean
) => {
  const normalizedStreet = street.trim()
  const normalizedNumber = number.trim()
  const normalizedSearch =
    normalizedStreet && normalizedNumber
      ? `${normalizedStreet}, ${normalizedNumber}`
      : ''
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID())

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(searchRequested ? normalizedSearch : ''),
      600
    )
    return () => window.clearTimeout(timer)
  }, [normalizedSearch, searchRequested])

  const query = useQuery({
    queryKey: [
      'checkout',
      'address-search',
      unitId,
      state,
      debouncedSearch,
      sessionToken,
    ],
    queryFn: () =>
      checkoutAddressSearchService.search(
        unitId as string,
        debouncedSearch,
        state ?? '',
        sessionToken
      ),
    enabled:
      !!unitId &&
      searchRequested &&
      state?.length === 2 &&
      debouncedSearch.length >= 3,
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

  const isWaitingForDebounce =
    searchRequested &&
    normalizedSearch.length > 0 &&
    normalizedSearch !== debouncedSearch

  return {
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
    resolveSelectedAddress: detailsMutation.mutateAsync,
    isResolvingSelectedAddress: detailsMutation.isPending,
  }
}
