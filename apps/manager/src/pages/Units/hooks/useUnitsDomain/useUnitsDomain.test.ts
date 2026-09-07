import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys'
import { TenantService } from '@shared/services/tenant/tenant.service'
import { useSessionStore } from '@shared/states/session/session.state'

import { useUnitsDomain } from './useUnitsDomain'
import { savedUnitMock, unitDraftMock } from './useUnitsDomain.mock'

const navigate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@shared/services/tenant/tenant.service')

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
  let client: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)

  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  })

  it('exposes the unit domain contract', () => {
    const { result } = renderHook(() => useUnitsDomain(), { wrapper })
    expect(result.current.limit.planName).toBe('Pro')
    expect(result.current.groups).toEqual([])
  })

  it('reads the unit of the session', async () => {
    vi.mocked(TenantService.getById).mockResolvedValue(savedUnitMock)

    const { result } = renderHook(() => useUnitsDomain(), { wrapper })

    await waitFor(() => expect(result.current.detail.isSuccess).toBe(true))
    expect(TenantService.getById).toHaveBeenCalledWith('tenant-1')
  })

  it('writes what was saved straight into the detail cache', async () => {
    vi.mocked(TenantService.saveTenant).mockResolvedValue(savedUnitMock)

    const { result } = renderHook(() => useUnitsDomain(), { wrapper })
    result.current.save.mutate(unitDraftMock)

    await waitFor(() => expect(result.current.save.isSuccess).toBe(true))
    expect(
      client.getQueryData([...queryKeys.tenant.all('tenant-1'), 'detail'])
    ).toEqual(savedUnitMock)
  })

  it('refreshes the units once another one becomes the head office', async () => {
    vi.mocked(TenantService.setMainTenant).mockResolvedValue(savedUnitMock)
    const invalidate = vi.spyOn(client, 'invalidateQueries')

    const { result } = renderHook(() => useUnitsDomain(), { wrapper })
    result.current.setMain.mutate('unit-2')

    await waitFor(() => expect(result.current.setMain.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.tenant.all('tenant-1'),
    })
  })

  it('drops the session and leaves once the store is closed', async () => {
    vi.mocked(TenantService.removeTenant).mockResolvedValue(undefined)
    const clear = vi.fn()
    vi.spyOn(useSessionStore, 'getState').mockReturnValue({
      clear,
    } as unknown as ReturnType<typeof useSessionStore.getState>)

    const { result } = renderHook(() => useUnitsDomain(), { wrapper })
    result.current.remove.mutate('unit-2')

    await waitFor(() => expect(result.current.remove.isSuccess).toBe(true))
    expect(clear).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
