import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ProductService } from '@shared/services/product/product.service'

import { useMenu } from './useMenu'
import { menuPageMock } from './useMenu.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { listMenu: vi.fn() },
}))

describe(useMenu.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('does not reload the menu when another consumer mounts', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    vi.mocked(ProductService.listMenu).mockResolvedValue(menuPageMock)

    const first = renderHook(() => useMenu('tenant-1'), { wrapper })
    await waitFor(() => expect(first.result.current.isPending).toBe(false))

    const second = renderHook(() => useMenu('tenant-1'), { wrapper })
    await waitFor(() => expect(second.result.current.isPending).toBe(false))

    expect(ProductService.listMenu).toHaveBeenCalledTimes(1)
  })
})
