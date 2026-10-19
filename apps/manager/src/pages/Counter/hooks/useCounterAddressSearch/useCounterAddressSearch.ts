import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

export const useCounterAddressSearch = (
  unitId: string | null,
  street: string,
  number: string,
  state: string,
  searchRequested = true
) => {
  const normalizedStreet = street.trim()
  const normalizedNumber = number.trim()
  const normalizedState = state.trim().toUpperCase()
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
      'counter',
      'address-search',
      unitId,
      debouncedSearch,
      normalizedState,
      sessionToken,
    ],
    queryFn: () =>
      CounterAddressSearchService.search(
        unitId as string,
        debouncedSearch,
        normalizedState,
        sessionToken
      ),
    enabled:
      !!unitId &&
      searchRequested &&
      debouncedSearch.length >= 3 &&
      normalizedState.length === 2,
    staleTime: 60_000,
    retry: false,
  })

  // WORKAROUND: the provider only prices autocomplete for free when a
  // session ends in exactly one details call, so the token must be replaced
  // once the guest confirms a selection — reusing it past that point would
  // mis-attribute the next search to an already-closed session.
  const detailsMutation = useMutation({
    mutationFn: (placeId: string) =>
      CounterAddressSearchService.details(
        unitId as string,
        placeId,
        sessionToken
      ),
    onSettled: () => setSessionToken(crypto.randomUUID()),
  })

  const reverseMutation = useMutation({
    mutationFn: ({ latitude, longitude }: UnitMapLocation) =>
      CounterAddressSearchService.reverse(
        unitId as string,
        latitude,
        longitude
      ),
  })

  const isWaitingForDebounce =
    normalizedStreet.length >= 3 &&
    normalizedNumber.length > 0 &&
    searchRequested &&
    normalizedState.length === 2 &&
    normalizedSearch !== debouncedSearch

  return {
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
    resolveSelectedAddress: detailsMutation.mutateAsync,
    isResolvingSelectedAddress: detailsMutation.isPending,
    resolveAddressAtPoint: reverseMutation.mutateAsync,
  }
}
