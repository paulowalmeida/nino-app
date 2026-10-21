import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useSubscriptionPlans } from '@shared/hooks/account/useSubscriptionPlans/useSubscriptionPlans'

import { useSubscriptionPlanChangeFacade } from './useSubscriptionPlanChangeFacade'
import { subscriptionPlanChangeFacadeMock } from './useSubscriptionPlanChangeFacade.mock'

vi.mock('@shared/hooks/account/useSubscription/useSubscription')
vi.mock('@shared/hooks/account/useSubscriptionPlans/useSubscriptionPlans')

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe(useSubscriptionPlanChangeFacade.name, () => {
  it('combines the subscription and plans needed by the journey', () => {
    vi.mocked(useSubscription).mockReturnValue({
      data: { plan: { name: subscriptionPlanChangeFacadeMock.planName } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSubscription>)
    vi.mocked(useSubscriptionPlans).mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSubscriptionPlans>)

    const { result } = renderHook(() => useSubscriptionPlanChangeFacade(), {
      wrapper,
    })

    expect(result.current.subscription?.plan.name).toBe(
      subscriptionPlanChangeFacadeMock.planName
    )
    expect(result.current.plans).toEqual([])
  })

  it('keeps the plans collection safe before the catalog resolves', () => {
    vi.mocked(useSubscription).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useSubscription>)
    vi.mocked(useSubscriptionPlans).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useSubscriptionPlans>)

    const { result } = renderHook(() => useSubscriptionPlanChangeFacade(), {
      wrapper,
    })

    expect(result.current.plans).toEqual([])
    expect(result.current.isPending).toBe(true)
  })
})
