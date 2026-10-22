import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { filledFormMock } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter.mock'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotionSave } from './usePromotionSave'
import { savePromotionIdMock, saveUnitIdMock } from './usePromotionSave.mock'

vi.mock('@shared/services/promotion/promotion.service/promotion.service', () => ({
  PromotionService: { create: vi.fn(), update: vi.fn() },
}))

const wrapperAt =
  (path: string) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/promocoes" element={<p>lista</p>} />
          <Route path="/promocoes/nova" element={children} />
          <Route path="/promocoes/:promotionId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )

describe(usePromotionSave.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('creates the campaign and goes back to the list', async () => {
    vi.mocked(PromotionService.create).mockResolvedValue(promotionMock)
    const { result } = renderHook(
      () => usePromotionSave(saveUnitIdMock, 'duplicate'),
      { wrapper: wrapperAt('/promocoes/nova') }
    )

    act(() => result.current.savePromotion(filledFormMock))

    await waitFor(() =>
      expect(PromotionService.create).toHaveBeenCalledWith(
        saveUnitIdMock,
        expect.objectContaining({ type: 'FREE_DELIVERY', perCustomerLimit: 1 })
      )
    )
    expect(await screen.findByText('lista')).toBeInTheDocument()
  })

  it('rewrites the campaign in edit mode', async () => {
    vi.mocked(PromotionService.update).mockResolvedValue(promotionMock)
    const { result } = renderHook(
      () => usePromotionSave(saveUnitIdMock, 'edit', savePromotionIdMock),
      { wrapper: wrapperAt(`/promocoes/${savePromotionIdMock}`) }
    )

    act(() => result.current.savePromotion(filledFormMock))

    await waitFor(() =>
      expect(PromotionService.update).toHaveBeenCalledWith(
        saveUnitIdMock,
        savePromotionIdMock,
        expect.objectContaining({ code: 'frete' })
      )
    )
    expect(PromotionService.create).not.toHaveBeenCalled()
  })
})
