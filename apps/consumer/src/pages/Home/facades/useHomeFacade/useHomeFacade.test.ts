import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCartSummary } from '@hooks/useCartSummary'
import { useMenu } from '@pages/Home/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'

import { useHomeFacade } from './useHomeFacade'
import { homeFacadeMock } from './useHomeFacade.mock'

vi.mock('@hooks/useCartSummary')
vi.mock('@pages/Home/hooks/useMenu/useMenu', () => ({ useMenu: vi.fn() }))
vi.mock('@hooks/useOpeningHours')
vi.mock('@hooks/usePublicSettings')
vi.mock('@hooks/useStore')

describe('useHomeFacade', () => {
  it('exposes the composed home contract for the requested store', () => {
    vi.mocked(useStore).mockReturnValue({ store: { id: homeFacadeMock.storeId }, isPending: false } as never)
    vi.mocked(useMenu).mockReturnValue({ sections: [], isPending: false } as never)
    vi.mocked(useOpeningHours).mockReturnValue({ hours: [], isPending: false } as never)
    vi.mocked(usePublicSettings).mockReturnValue({ settings: { estimatedMinutes: homeFacadeMock.estimatedMinutes } } as never)
    vi.mocked(useCartSummary).mockReturnValue({ lines: {}, cartLines: [], count: 0, total: 0 } as never)

    const { result } = renderHook(() => useHomeFacade(homeFacadeMock.slug))

    expect(useStore).toHaveBeenCalledWith(homeFacadeMock.slug)
    expect(useMenu).toHaveBeenCalledWith(homeFacadeMock.storeId)
    expect(result.current.estimatedMinutes).toBe(homeFacadeMock.estimatedMinutes)
    expect(result.current.cartCount).toBe(0)
  })
})
