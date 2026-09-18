import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { CounterAddressSearchService } from '@pages/Counter/services/counter-address-search.service/counter-address-search.service'

export const useCounterAddressSearch = (
  unitId: string | null,
  street: string,
  state: string
) => {
  const normalizedStreet = street.trim()
  const normalizedState = state.trim().toUpperCase()
  const [debouncedStreet, setDebouncedStreet] = useState('')
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID())

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
      unitId,
      debouncedStreet,
      normalizedState,
      sessionToken,
    ],
    queryFn: () =>
      CounterAddressSearchService.search(
        unitId as string,
        debouncedStreet,
        normalizedState,
        sessionToken
      ),
    enabled:
      !!unitId && debouncedStreet.length >= 3 && normalizedState.length === 2,
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

  const isWaitingForDebounce =
    normalizedStreet.length >= 3 &&
    normalizedState.length === 2 &&
    normalizedStreet !== debouncedStreet

  return {
    suggestions: query.data ?? [],
    isSearching: isWaitingForDebounce || query.isFetching,
    resolveSelectedAddress: detailsMutation.mutateAsync,
    isResolvingSelectedAddress: detailsMutation.isPending,
  }
}
