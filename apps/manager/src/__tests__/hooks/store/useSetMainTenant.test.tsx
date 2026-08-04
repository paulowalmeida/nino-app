import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSetMainTenant } from '@hooks/store/useSetMainTenant'
import { TenantService } from '@services/tenant.service'

import { tenantDetail } from './useTenantDetail.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSetMainTenant.name, () => {
  it('invalidates the tenant queries on success', async () => {
    // Arrange
    const client = new QueryClient()
    const invalidateQueries = vi.spyOn(client, 'invalidateQueries')
    vi.mocked(TenantService.setMainTenant).mockResolvedValue(tenantDetail)
    const { result } = renderHook(() => useSetMainTenant('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('tenant-1')

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['tenant', 'tenant-1'],
    })
  })

  it('reports the mutation as failed when the request errors', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.setMainTenant).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useSetMainTenant('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('tenant-1')

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
