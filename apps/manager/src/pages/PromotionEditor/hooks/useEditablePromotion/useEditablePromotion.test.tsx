import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { useEditablePromotion } from './useEditablePromotion'
import {
  editableUnitIdMock,
  usedPromotionMock,
} from './useEditablePromotion.mock'

vi.mock('@shared/hooks/promotion/usePromotions/usePromotions')

const at =
  (path: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/promocoes/nova" element={children} />
        <Route path="/promocoes/:promotionId" element={children} />
      </Routes>
    </MemoryRouter>
  )

describe(useEditablePromotion.name, () => {
  beforeEach(() =>
    vi.mocked(usePromotions).mockReturnValue({
      data: [promotionMock, usedPromotionMock],
      isPending: false,
    } as unknown as ReturnType<typeof usePromotions>)
  )

  it('opens a blank campaign without asking for the list', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at('/promocoes/nova'),
      }
    )

    expect(result.current).toMatchObject({
      mode: 'create',
      isUnavailable: false,
    })
    expect(usePromotions).toHaveBeenCalledWith(null)
  })

  it('edits an unused campaign from the route', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at(`/promocoes/${promotionMock.id}`),
      }
    )

    expect(result.current).toMatchObject({
      mode: 'edit',
      promotion: promotionMock,
      isUnavailable: false,
    })
  })

  it('refuses to edit a campaign that was already used', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at(`/promocoes/${usedPromotionMock.id}`),
      }
    )

    expect(result.current.isUnavailable).toBe(true)
  })

  it('duplicates a used campaign', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at(`/promocoes/nova?duplicar=${usedPromotionMock.id}`),
      }
    )

    expect(result.current).toMatchObject({
      mode: 'duplicate',
      promotion: usedPromotionMock,
      isUnavailable: false,
    })
  })
})
