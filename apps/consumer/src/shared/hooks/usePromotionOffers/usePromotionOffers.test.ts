import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'

import { usePromotionOffers } from './usePromotionOffers'
import { offerUnitIdMock, visibleOfferMock } from './usePromotionOffers.mock'

let queryOptions: { queryKey: unknown; enabled: boolean } | undefined
let queryData: unknown

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: queryData, refetch: vi.fn() }
  },
}))

describe('usePromotionOffers', () => {
  it('waits for the store before asking for its campaigns', () => {
    renderHook(() => usePromotionOffers(undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.promotions.visibleByUnit(''))
    expect(queryOptions?.enabled).toBe(false)
  })

  it('splits what the store shows into free delivery, discounts and coupons', () => {
    queryData = visibleOfferMock

    const { result } = renderHook(() => usePromotionOffers(offerUnitIdMock))

    expect(result.current.freeDelivery?.id).toBe('promotion-1')
    expect(result.current.discountOffers.map(({ id }) => id)).toEqual([
      'promotion-2',
    ])
    expect(result.current.couponSuggestions.map(({ id }) => id)).toEqual([
      'promotion-3',
    ])
  })
})
