import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTenantDetail } from '@hooks/store/useTenantDetail'
import { TenantService } from '@services/tenant.service'

import { tenantDetail } from './useTenantDetail.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useTenantDetail.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the tenant detail', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.getById).mockResolvedValue(tenantDetail)

    // Act
    const { result } = renderHook(() => useTenantDetail('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(tenantDetail))
  })

  it('stays disabled with no tenant id', () => {
    // Arrange
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useTenantDetail(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(TenantService.getById).not.toHaveBeenCalled()
  })
})
