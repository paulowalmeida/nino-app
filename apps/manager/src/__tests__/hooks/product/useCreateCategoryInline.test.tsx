import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateCategoryInline } from '@hooks/product/useCreateCategoryInline'
import { CategoryService } from '@services/category.service'

import { createdCategory } from './useCreateCategoryInline.mock'

vi.mock('@services/category.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCreateCategoryInline.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates the category and clears the field on success', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      createdCategory
    )
    const { result } = renderHook(() => useCreateCategoryInline('tenant-1'), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.setName('  Sobremesas  '))

    // Act
    await act(async () => result.current.submit())

    // Assert
    expect(CategoryService.createCategory).toHaveBeenCalledWith(
      'tenant-1',
      'Sobremesas'
    )
    await waitFor(() => expect(result.current.name).toBe(''))
  })

  it('does not submit a blank or whitespace-only name', async () => {
    // Arrange
    const client = new QueryClient()
    const { result } = renderHook(() => useCreateCategoryInline('tenant-1'), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.setName('   '))

    // Act
    await act(async () => result.current.submit())

    // Assert
    expect(CategoryService.createCategory).not.toHaveBeenCalled()
  })

  it('keeps the typed name in the field when the request fails', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CategoryService.createCategory).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useCreateCategoryInline('tenant-1'), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.setName('Sobremesas'))

    // Act
    await act(async () => result.current.submit())

    // Assert
    expect(result.current.name).toBe('Sobremesas')
  })
})
