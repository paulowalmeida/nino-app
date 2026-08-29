import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import { useMenu } from '@pages/Home/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'

import { useHomeFacade } from './useHomeFacade'
import { homeFacadeMock } from './useHomeFacade.mock'

vi.mock('@hooks/useCartSummary/useCartSummary')
vi.mock('@pages/Home/hooks/useMenu/useMenu', () => ({ useMenu: vi.fn() }))
vi.mock('@hooks/useOpeningHours/useOpeningHours')
vi.mock('@hooks/usePublicSettings/usePublicSettings')
vi.mock('@hooks/useStore/useStore')

describe('useHomeFacade', () => {
  it('exposes the composed home contract for the requested store', () => {
    vi.mocked(useStore).mockReturnValue({
      store: { id: homeFacadeMock.storeId },
      isPending: false,
    } as unknown as ReturnType<typeof useStore>)
    vi.mocked(useMenu).mockReturnValue({
      sections: [],
      isPending: false,
    } as unknown as ReturnType<typeof useMenu>)
    vi.mocked(useOpeningHours).mockReturnValue({
      hours: [],
      isPending: false,
    } as unknown as ReturnType<typeof useOpeningHours>)
    vi.mocked(usePublicSettings).mockReturnValue({
      settings: {
        preparationMinutes: 25,
        deliveryMinutes: 10,
      },
      estimatedMinutes: 35,
    } as unknown as ReturnType<typeof usePublicSettings>)
    vi.mocked(useCartSummary).mockReturnValue({
      lines: {},
      cartLines: [],
      count: 0,
      total: 0,
    } as unknown as ReturnType<typeof useCartSummary>)

    const { result } = renderHook(() => useHomeFacade(homeFacadeMock.slug))

    expect(useStore).toHaveBeenCalledWith(homeFacadeMock.slug)
    expect(useMenu).toHaveBeenCalledWith(homeFacadeMock.storeId)
    expect(result.current.estimatedMinutes).toBe(
      homeFacadeMock.estimatedMinutes
    )
    expect(result.current.cartCount).toBe(0)
  })
})
