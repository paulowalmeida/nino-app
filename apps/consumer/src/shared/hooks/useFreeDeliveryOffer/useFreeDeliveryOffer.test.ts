import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'

import { useFreeDeliveryOffer } from './useFreeDeliveryOffer'
import { offerUnitIdMock, visibleOfferMock } from './useFreeDeliveryOffer.mock'

let queryOptions: { queryKey: unknown; enabled: boolean } | undefined
let queryData: unknown

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: queryData, refetch: vi.fn() }
  },
}))

describe('useFreeDeliveryOffer', () => {
  it('waits for the store before asking for its campaigns', () => {
    renderHook(() => useFreeDeliveryOffer(undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.promotions.visibleByUnit(''))
    expect(queryOptions?.enabled).toBe(false)
  })

  it('exposes the free delivery the store shows on the menu', () => {
    queryData = visibleOfferMock

    const { result } = renderHook(() => useFreeDeliveryOffer(offerUnitIdMock))

    expect(result.current.freeDelivery?.id).toBe('promotion-1')
  })
})
