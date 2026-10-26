import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { UnitAddressSearchService } from '@pages/Units/services/unit-address-search.service/unit-address-search.service'

const SEARCH_DEBOUNCE_MS = 500

export const useUnitAddressSearch = (
  unitId: string | null,
  street: string,
  number: string,
  state: string,
  city: string,
  searchRequested: boolean
) => {
  const normalizedStreet = street.trim()
  const normalizedNumber = number.trim()
  const normalizedState = state.trim().toUpperCase()
  const normalizedCity = city.trim()
  const normalizedSearch =
    normalizedStreet && normalizedNumber
      ? `${normalizedStreet}, ${normalizedNumber}`
      : ''
  const [debouncedStreet, setDebouncedStreet] = useState('')
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID())

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedStreet(searchRequested ? normalizedSearch : ''),
      SEARCH_DEBOUNCE_MS
    )
    return () => window.clearTimeout(timer)
  }, [normalizedSearch, searchRequested])

  const query = useQuery({
    queryKey: [
      'units',
      'address-search',
      unitId,
      debouncedStreet,
      normalizedState,
      normalizedCity,
      sessionToken,
    ],
    queryFn: () =>
      UnitAddressSearchService.search(
        unitId as string,
        debouncedStreet,
        normalizedState,
        sessionToken,
        normalizedCity
      ),
    enabled:
      !!unitId &&
      searchRequested &&
      debouncedStreet.length >= 3 &&
      normalizedState.length === 2 &&
      normalizedCity.length > 0,
    staleTime: 60_000,
    retry: false,
  })

  const detailsMutation = useMutation({
    mutationFn: (placeId: string) =>
      UnitAddressSearchService.details(unitId as string, placeId, sessionToken),
    onSettled: () => setSessionToken(crypto.randomUUID()),
  })

  const isWaitingForDebounce =
    normalizedSearch.length >= 3 &&
    searchRequested &&
    normalizedState.length === 2 &&
    normalizedCity.length > 0 &&
    normalizedSearch !== debouncedStreet

  return {
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
    resolveSelectedAddress: detailsMutation.mutateAsync,
    isResolvingSelectedAddress: detailsMutation.isPending,
  }
}
