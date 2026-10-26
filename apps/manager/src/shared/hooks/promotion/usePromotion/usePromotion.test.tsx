import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import {
  promotionIdMock,
  promotionMock,
  promotionUnitIdMock,
} from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotion } from './usePromotion'

vi.mock('@shared/services/promotion/promotion.service/promotion.service', () => ({
  PromotionService: { getById: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe(usePromotion.name, () => {
  it('loads one campaign and waits until there is one to load', async () => {
    vi.mocked(PromotionService.getById).mockResolvedValue(promotionMock)

    const { result } = renderHook(
      () => usePromotion(promotionUnitIdMock, promotionIdMock),
      { wrapper }
    )
    await waitFor(() => expect(result.current.data).toEqual(promotionMock))

    renderHook(() => usePromotion(promotionUnitIdMock, null), { wrapper })
    expect(PromotionService.getById).toHaveBeenCalledTimes(1)
  })
})
