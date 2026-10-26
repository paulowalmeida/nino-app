import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import {
  promotionListQueryMock,
  promotionPageMock,
} from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotions } from './usePromotions'
import { promotionsUnitIdMock } from './usePromotions.mock'

vi.mock('@shared/services/promotion/promotion.service/promotion.service', () => ({
  PromotionService: { list: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe(usePromotions.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('loads the requested page of the unit campaigns', async () => {
    vi.mocked(PromotionService.list).mockResolvedValue(promotionPageMock)

    const { result } = renderHook(
      () => usePromotions(promotionsUnitIdMock, promotionListQueryMock),
      { wrapper }
    )

    await waitFor(() => expect(result.current.data).toEqual(promotionPageMock))
    expect(PromotionService.list).toHaveBeenCalledWith(
      promotionsUnitIdMock,
      promotionListQueryMock
    )
  })

  it('waits for a unit before asking the API', () => {
    renderHook(() => usePromotions(null, promotionListQueryMock), { wrapper })

    expect(PromotionService.list).not.toHaveBeenCalled()
  })
})
