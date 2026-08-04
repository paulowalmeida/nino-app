import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSaveTenant } from '@hooks/store/useSaveTenant'
import { TenantService } from '@services/tenant.service'

import { tenantDetail } from './useTenantDetail.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSaveTenant.name, () => {
  it('writes the saved tenant into the detail cache', async () => {
    // Arrange
    const client = new QueryClient()
    const updated = { ...tenantDetail, customName: 'Padaria Nova' }
    vi.mocked(TenantService.updateTenant).mockResolvedValue(updated)
    const { result } = renderHook(() => useSaveTenant('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ customName: 'Padaria Nova' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      client.getQueryData(['tenant', 'tenant-1', 'detail'])
    ).toEqual(updated)
  })

  it('reports the mutation as failed when the request errors', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.updateTenant).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useSaveTenant('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ customName: 'Padaria Nova' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
