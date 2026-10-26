import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'

import { useOpeningHours } from './useOpeningHours'
import { useOpeningHoursMock } from './useOpeningHours.mock'

let queryOptions:
  | { queryKey: unknown; queryFn: () => unknown; enabled: boolean }
  | undefined
let queryData: unknown

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: queryData }
  },
}))

describe('useOpeningHours', () => {
  it('uses the unit cache key and does not request without a unit', () => {
    renderHook(() => useOpeningHours(undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.openingHours.byUnit(''))
    expect(queryOptions?.enabled).toBe(false)
  })

  it('exposes an empty hours list while the request has no data', () => {
    queryData = undefined

    const { result } = renderHook(() => useOpeningHours('unit-1'))

    expect(result.current.hours).toEqual([])
  })

  it('exposes the public opening hours returned by the query', () => {
    queryData = useOpeningHoursMock.hours

    const { result } = renderHook(() => useOpeningHours('unit-1'))

    expect(result.current.hours).toEqual(useOpeningHoursMock.hours)
  })
})
