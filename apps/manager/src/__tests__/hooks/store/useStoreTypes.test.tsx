import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStoreTypes } from '@hooks/store/useStoreTypes'
import { TenantService } from '@services/tenant.service'

import { storeTypes } from './useStoreTypes.mock'

vi.mock('@services/tenant.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useStoreTypes.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the catalog of store types', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.listStoreTypes).mockResolvedValue(storeTypes)

    // Act
    const { result } = renderHook(() => useStoreTypes(), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(storeTypes))
  })

  it('does not refetch on a second mount within the session', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(TenantService.listStoreTypes).mockResolvedValue(storeTypes)
    const { result, unmount } = renderHook(() => useStoreTypes(), {
      wrapper: wrapWithClient(client),
    })
    await waitFor(() => expect(result.current.data).toEqual(storeTypes))
    unmount()

    // Act
    renderHook(() => useStoreTypes(), { wrapper: wrapWithClient(client) })

    // Assert
    expect(TenantService.listStoreTypes).toHaveBeenCalledTimes(1)
  })
})
