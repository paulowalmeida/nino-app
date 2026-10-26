import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotionStatusChange } from './usePromotionStatusChange'
import {
  statusChangePromotionIdMock,
  statusChangeUnitIdMock,
} from './usePromotionStatusChange.mock'

vi.mock('@shared/services/promotion/promotion.service/promotion.service', () => ({
  PromotionService: { pause: vi.fn(), resume: vi.fn(), end: vi.fn() },
}))

const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe(usePromotionStatusChange.name, () => {
  afterEach(() => vi.clearAllMocks())

  it.each(['pause', 'resume', 'end'] as const)(
    '%s calls the API and reloads the campaign list',
    async (command) => {
      vi.mocked(PromotionService[command]).mockResolvedValue(promotionMock)
      const invalidate = vi.spyOn(client, 'invalidateQueries')
      const { result } = renderHook(
        () => usePromotionStatusChange(statusChangeUnitIdMock),
        { wrapper }
      )

      act(() => result.current[command](statusChangePromotionIdMock))

      await waitFor(() =>
        expect(invalidate).toHaveBeenCalledWith({
          queryKey: queryKeys.promotions.all(statusChangeUnitIdMock),
        })
      )
      expect(PromotionService[command]).toHaveBeenCalledWith(
        statusChangeUnitIdMock,
        statusChangePromotionIdMock
      )
    }
  )

  it('marks the campaign being paused as busy', async () => {
    vi.mocked(PromotionService.pause).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(
      () => usePromotionStatusChange(statusChangeUnitIdMock),
      { wrapper }
    )

    act(() => result.current.pause(statusChangePromotionIdMock))

    await waitFor(() =>
      expect(result.current.changingId).toBe(statusChangePromotionIdMock)
    )
  })
})
