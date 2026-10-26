import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotion } from '@shared/hooks/promotion/usePromotion/usePromotion'

import { useEditablePromotion } from './useEditablePromotion'
import {
  editablePromotionMock,
  editableUnitIdMock,
  retiredFreeDeliveryMock,
  usedPromotionMock,
} from './useEditablePromotion.mock'

vi.mock('@shared/hooks/promotion/usePromotion/usePromotion')

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
    vi.mocked(usePromotion).mockImplementation(
      (_, promotionId) =>
        ({
          data: [
            editablePromotionMock,
            usedPromotionMock,
            retiredFreeDeliveryMock,
          ].find(({ id }) => id === promotionId),
          isPending: false,
        }) as unknown as ReturnType<typeof usePromotion>
    )
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
    expect(usePromotion).toHaveBeenCalledWith(editableUnitIdMock, null)
  })

  it('edits an unused campaign from the route', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at(`/promocoes/${editablePromotionMock.id}`),
      }
    )

    expect(result.current).toMatchObject({
      mode: 'edit',
      promotion: editablePromotionMock,
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

  it('refuses to reopen a retired free delivery campaign', () => {
    const { result } = renderHook(
      () => useEditablePromotion(editableUnitIdMock),
      {
        wrapper: at(`/promocoes/nova?duplicar=${retiredFreeDeliveryMock.id}`),
      }
    )

    expect(result.current.isUnavailable).toBe(true)
  })
})
