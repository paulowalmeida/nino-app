import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
  afterEach(() => {
    queryData = undefined
  })

  it('waits for the store before asking for its campaigns', () => {
    renderHook(() => usePromotionOffers(undefined))

    expect(queryOptions?.queryKey).toEqual(
      queryKeys.promotions.visibleByUnit('')
    )
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
      'promotion-2',
      'promotion-3',
    ])
  })

  it('exposes package promotions only when the API returns package groups', () => {
    queryData = [
      {
        ...visibleOfferMock[0],
        id: 'package-with-groups',
        type: 'PACKAGE',
        packageGroups: [
          {
            id: 'group-1',
            kind: 'FIXED',
            quantity: 1,
            allowRepeatedProducts: false,
            products: [],
          },
        ],
      },
      {
        ...visibleOfferMock[0],
        id: 'package-without-groups',
        type: 'PACKAGE',
        packageGroups: [],
      },
    ]

    const { result } = renderHook(() => usePromotionOffers(offerUnitIdMock))

    expect(result.current.packageOffers.map(({ id }) => id)).toEqual([
      'package-with-groups',
    ])
  })
})
