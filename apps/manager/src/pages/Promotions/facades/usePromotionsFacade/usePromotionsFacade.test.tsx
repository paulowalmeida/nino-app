import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionStatusChange } from '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotionsFacade } from './usePromotionsFacade'
import { promotionsFacadeUnitIdMock } from './usePromotionsFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/promotion/usePromotions/usePromotions')
vi.mock(
  '@pages/Promotions/hooks/usePromotionStatusChange/usePromotionStatusChange'
)

describe('usePromotionsFacade', () => {
  it('joins the campaign list and the status commands of the current unit', () => {
    const pause = vi.fn()
    const refetch = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: promotionsFacadeUnitIdMock,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(usePromotions).mockReturnValue({
      data: [promotionMock],
      isPending: false,
      isError: false,
      refetch,
    } as unknown as ReturnType<typeof usePromotions>)
    vi.mocked(usePromotionStatusChange).mockReturnValue({
      pause,
    } as unknown as ReturnType<typeof usePromotionStatusChange>)

    const { result } = renderHook(() => usePromotionsFacade())

    expect(usePromotions).toHaveBeenCalledWith(promotionsFacadeUnitIdMock)
    expect(usePromotionStatusChange).toHaveBeenCalledWith(
      promotionsFacadeUnitIdMock
    )
    expect(result.current.promotions).toEqual([promotionMock])
    expect(result.current.pause).toBe(pause)
    expect(result.current.retry).toBe(refetch)
  })
})
