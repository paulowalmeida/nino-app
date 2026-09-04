import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitsDomain } from './useUnitsDomain'

vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
}))
vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [],
}))
vi.mock('@shared/hooks/account/useSubscription/useSubscription', () => ({
  useSubscription: () => ({
    data: { plan: { name: 'Pro', maxTenants: 3 } },
    isPending: false,
  }),
}))

describe(useUnitsDomain.name, () => {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: new QueryClient() }, children)

  it('exposes the unit domain contract', () => {
    const { result } = renderHook(() => useUnitsDomain(), { wrapper })
    expect(result.current.limit.planName).toBe('Pro')
    expect(result.current.groups).toEqual([])
  })
})
