import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionListQuery } from '@pages/Promotions/hooks/ui/usePromotionListQuery/usePromotionListQuery'
import { usePromotionStatusChange } from '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import {
  promotionListQueryMock,
  promotionMock,
  promotionPageMock,
} from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotionsFacade } from './usePromotionsFacade'
import { promotionsFacadeUnitIdMock } from './usePromotionsFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/promotion/usePromotions/usePromotions')
vi.mock(
  '@pages/Promotions/hooks/ui/usePromotionListQuery/usePromotionListQuery'
)
vi.mock(
  '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
)

describe('usePromotionsFacade', () => {
  it('asks the API for the page the list query describes', () => {
    const pause = vi.fn()
    const refetch = vi.fn()
    const changeSort = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: promotionsFacadeUnitIdMock,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(usePromotionListQuery).mockReturnValue({
      query: promotionListQueryMock,
      changeSort,
    } as unknown as ReturnType<typeof usePromotionListQuery>)
    vi.mocked(usePromotions).mockReturnValue({
      data: promotionPageMock,
      isPending: false,
      isError: false,
      refetch,
    } as unknown as ReturnType<typeof usePromotions>)
    vi.mocked(usePromotionStatusChange).mockReturnValue({
      pause,
    } as unknown as ReturnType<typeof usePromotionStatusChange>)

    const { result } = renderHook(() => usePromotionsFacade())

    expect(usePromotions).toHaveBeenCalledWith(
      promotionsFacadeUnitIdMock,
      promotionListQueryMock
    )
    expect(result.current).toMatchObject({
      promotions: [promotionMock],
      tabCounts: promotionPageMock.tabCounts,
      total: 1,
      pause,
      changeSort,
      retry: refetch,
    })
  })
})
