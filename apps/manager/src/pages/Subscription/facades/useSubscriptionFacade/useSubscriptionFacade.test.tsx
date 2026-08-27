import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'

import { useSubscriptionFacade } from './useSubscriptionFacade'
import { subscriptionFacadeMock } from './useSubscriptionFacade.mock'

vi.mock('@shared/hooks/account/useSubscription/useSubscription')

describe('useSubscriptionFacade', () => {
  beforeEach(() => vi.clearAllMocks())

  it('names the loaded subscription for the screen', () => {
    vi.mocked(useSubscription).mockReturnValue({
      data: { plan: { name: subscriptionFacadeMock.planName } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSubscription>)

    const { result } = renderHook(() => useSubscriptionFacade())

    expect(result.current.subscription?.plan.name).toBe(
      subscriptionFacadeMock.planName
    )
    expect(result.current.isPending).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('reports the pending and failed reads of the plan', () => {
    vi.mocked(useSubscription).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: true,
    } as unknown as ReturnType<typeof useSubscription>)

    const { result } = renderHook(() => useSubscriptionFacade())

    expect(result.current.subscription).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isError).toBe(true)
  })
})
