import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNewOrderAvailability } from '@pages/NewOrder/hooks/useNewOrderAvailability/useNewOrderAvailability'
import { useNewOrderDraft } from '@pages/NewOrder/hooks/useNewOrderDraft/useNewOrderDraft'
import { useNewOrderPlacement } from '@pages/NewOrder/hooks/useNewOrderPlacement/useNewOrderPlacement'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useNewOrderFacade } from './useNewOrderFacade'
import { newOrderFacadeMock } from './useNewOrderFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@shared/hooks/product/useMenu/useMenu')
vi.mock('@pages/NewOrder/hooks/useNewOrderDraft/useNewOrderDraft')
vi.mock('@pages/NewOrder/hooks/useNewOrderAvailability/useNewOrderAvailability')
vi.mock('@pages/NewOrder/hooks/useNewOrderPlacement/useNewOrderPlacement')

const reset = vi.fn()
const placeOrder = vi.fn()
const draft = { lines: [], reset, subtotal: 0 }
const availability = { method: newOrderFacadeMock.paymentMethod }

describe('useNewOrderFacade', () => {
  it('wires menu, draft, availability, and placement under one boundary', () => {
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: newOrderFacadeMock.unitId,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useMenu).mockReturnValue({
      sections: [{ id: 'section-1' }],
      isPending: false,
    } as unknown as ReturnType<typeof useMenu>)
    vi.mocked(useNewOrderDraft).mockReturnValue(
      draft as unknown as ReturnType<typeof useNewOrderDraft>
    )
    vi.mocked(useNewOrderAvailability).mockReturnValue(
      availability as unknown as ReturnType<typeof useNewOrderAvailability>
    )
    vi.mocked(useNewOrderPlacement).mockReturnValue({
      failed: false,
      isSubmitting: false,
      placeOrder,
    } as unknown as ReturnType<typeof useNewOrderPlacement>)

    const { result } = renderHook(() => useNewOrderFacade())

    expect(useMenu).toHaveBeenCalledWith(newOrderFacadeMock.unitId)
    expect(useNewOrderAvailability).toHaveBeenCalledWith(
      newOrderFacadeMock.unitId,
      draft
    )
    expect(useNewOrderPlacement).toHaveBeenCalledWith(
      newOrderFacadeMock.unitId,
      draft,
      newOrderFacadeMock.paymentMethod
    )
    expect(result.current.sections).toHaveLength(1)
    expect(result.current.isMenuPending).toBe(false)
    expect(result.current.draft).toBe(draft)
    expect(result.current.availability).toBe(availability)
    expect(result.current.placeOrder).toBe(placeOrder)
    expect(result.current.resetDraft).toBe(reset)
  })

  it('works with no unit until the session is known', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useMenu).mockReturnValue({
      sections: [],
      isPending: true,
    } as unknown as ReturnType<typeof useMenu>)
    vi.mocked(useNewOrderDraft).mockReturnValue(
      draft as unknown as ReturnType<typeof useNewOrderDraft>
    )
    vi.mocked(useNewOrderAvailability).mockReturnValue(
      availability as unknown as ReturnType<typeof useNewOrderAvailability>
    )
    vi.mocked(useNewOrderPlacement).mockReturnValue({
      failed: true,
      isSubmitting: false,
      placeOrder,
    } as unknown as ReturnType<typeof useNewOrderPlacement>)

    const { result } = renderHook(() => useNewOrderFacade())

    expect(useMenu).toHaveBeenLastCalledWith(null)
    expect(result.current.isMenuPending).toBe(true)
    expect(result.current.failed).toBe(true)
  })
})
