import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryService } from '@shared/services/category/category.service'

import { useReorderCategories } from './useReorderCategories'
import { reorderCategoriesMock } from './useReorderCategories.mock'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { reorderCategories: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useReorderCategories.name, () => {
  it('sends the complete category order', async () => {
    vi.mocked(CategoryService.reorderCategories).mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useReorderCategories(reorderCategoriesMock.unitId), { wrapper })
    await result.current.mutateAsync({ ids: reorderCategoriesMock.ids })
    expect(CategoryService.reorderCategories).toHaveBeenCalledWith(
      reorderCategoriesMock.unitId,
      reorderCategoriesMock.ids
    )
  })
})
