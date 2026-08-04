import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCategories } from '@hooks/product/useCategories'
import { CategoryService } from '@services/category.service'

import { categoryList } from './useCategories.mock'

vi.mock('@services/category.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCategories.name, () => {
  it('lists categories for the tenant', async () => {
    // Arrange
    vi.mocked(CategoryService.listCategories).mockResolvedValue(categoryList)
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.categories).toHaveLength(2))
  })

  it('stays disabled with no tenant id', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(() => useCategories(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.categories).toEqual([])
  })
})
