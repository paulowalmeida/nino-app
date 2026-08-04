import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMenu } from '@hooks/product/useMenu'
import { ProductService } from '@services/product.service'

import { emptyMenuPage, menuPage } from './useMenu.mock'

vi.mock('@services/product.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useMenu.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('groups items by category sorted by category position', async () => {
    // Arrange
    vi.mocked(ProductService.listMenu).mockResolvedValue(menuPage)

    // Act
    const { result } = renderHook(() => useMenu('tenant-1'), {
      wrapper: wrapWithClient(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(result.current.sections.map((section) => section.id)).toEqual([
      'cat-b',
      'cat-a',
    ])
    expect(result.current.sections[1].items).toHaveLength(1)
  })

  it('returns no sections with an empty menu', async () => {
    // Arrange
    vi.mocked(ProductService.listMenu).mockResolvedValue(emptyMenuPage)

    // Act
    const { result } = renderHook(() => useMenu('tenant-1'), {
      wrapper: wrapWithClient(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(result.current.sections).toEqual([])
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useMenu(null), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(ProductService.listMenu).not.toHaveBeenCalled()
  })
})
