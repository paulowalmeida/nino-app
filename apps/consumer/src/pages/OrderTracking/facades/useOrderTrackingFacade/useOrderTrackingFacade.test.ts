import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderTrackingFacade } from './useOrderTrackingFacade'
import { useOrderTrackingFacadeMock } from './useOrderTrackingFacade.mock'

const routeState = vi.hoisted(() => ({
  token: 'token-1' as string | undefined,
}))

vi.mock('react-router', () => ({
  useParams: () => ({ slug: 'loja', orderId: 'order-1' }),
  useSearchParams: () => [
    new URLSearchParams(routeState.token ? `token=${routeState.token}` : ''),
  ],
}))
vi.mock(
  '@pages/order-tracking/hooks/useOrderTrackingStatus/useOrderTrackingStatus',
  () => ({ useOrderTrackingStatus: () => ({ isPending: false }) })
)
vi.mock('@hooks/useScrollProgress/useScrollProgress', () => ({
  useScrollProgress: () => useOrderTrackingFacadeMock.progress,
}))
vi.mock('@utils/resolve-back-href', () => ({
  resolveBackHref: () => useOrderTrackingFacadeMock.backHref,
}))
describe('useOrderTrackingFacade', () => {
  beforeEach(() => {
    routeState.token = 'token-1'
  })

  it('exposes route presentation values and tracking state', () => {
    const { result } = renderHook(() => useOrderTrackingFacade())
    expect(result.current.backHref).toBe(useOrderTrackingFacadeMock.backHref)
    expect(result.current.progress).toBe(useOrderTrackingFacadeMock.progress)
  })

  it('accepts a missing tracking token', () => {
    routeState.token = undefined

    const { result } = renderHook(() => useOrderTrackingFacade())

    expect(result.current).toBeDefined()
  })
})
