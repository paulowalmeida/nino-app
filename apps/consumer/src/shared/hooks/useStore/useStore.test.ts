import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'

import { useStore } from './useStore'
import { useStoreMock } from './useStore.mock'

let queryOptions:
  | {
      queryKey: unknown
      enabled: boolean
      staleTime: number
      refetchOnWindowFocus: boolean
    }
  | undefined
let queryData: unknown

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: queryData }
  },
}))

describe('useStore', () => {
  it('uses the store slug cache key and stays disabled without a slug', () => {
    renderHook(() => useStore(undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.store.bySlug(''))
    expect(queryOptions?.enabled).toBe(false)
    expect(queryOptions?.staleTime).toBe(0)
    expect(queryOptions?.refetchOnWindowFocus).toBe(true)
  })

  it('exposes the loaded store', () => {
    queryData = useStoreMock.store

    const { result } = renderHook(() => useStore('pizzaria'))

    expect(result.current.store).toEqual(useStoreMock.store)
  })
})
