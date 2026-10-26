import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryService } from '@shared/services/category/category.service'

import { useUpdateCategory } from './useUpdateCategory'
import { updateCategoryMock } from './useUpdateCategory.mock'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { updateCategory: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useUpdateCategory.name, () => {
  it('sends the renamed category within the selected unit', async () => {
    vi.mocked(CategoryService.updateCategory).mockResolvedValue({
      id: updateCategoryMock.id,
      name: updateCategoryMock.name,
      position: 0,
    })
    const { result } = renderHook(() => useUpdateCategory(updateCategoryMock.unitId), { wrapper })
    await result.current.mutateAsync({ id: updateCategoryMock.id, name: updateCategoryMock.name })
    expect(CategoryService.updateCategory).toHaveBeenCalledWith(
      updateCategoryMock.unitId,
      updateCategoryMock.id,
      updateCategoryMock.name
    )
  })
})
