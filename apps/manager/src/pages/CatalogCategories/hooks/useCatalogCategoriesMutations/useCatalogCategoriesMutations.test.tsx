import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { CATEGORIES_HAS_PRODUCTS_HINT } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { useCatalogCategoriesMutations } from '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { queryKeys } from '@shared/lib/query-keys'
import { CategoryService } from '@shared/services/category/category.service'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'
import type { ProductCategory } from '@shared/types/product/product-category'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: {
    createCategory: vi.fn(),
    removeCategory: vi.fn(),
    reorderCategories: vi.fn(),
    updateCategory: vi.fn(),
  },
}))

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

describe(useCatalogCategoriesMutations.name, () => {
  beforeEach(() => {
    useCatalogCategoriesStore.setState({
      createName: '',
      order: [],
      deleteTarget: null,
      deleteError: null,
    })
  })
  afterEach(() => vi.clearAllMocks())

  it('creates the trimmed draft and clears it after success', async () => {
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      {} as ProductCategory
    )
    useCatalogCategoriesStore.getState().setCreateName('  Bebidas  ')
    const { wrapper } = createHarness()
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() => result.current.submitCreate())

    expect(CategoryService.createCategory).toHaveBeenCalledWith(
      'tenant-1',
      'Bebidas'
    )
    expect(useCatalogCategoriesStore.getState().createName).toBe('')
  })

  it('ignores an empty category draft', async () => {
    useCatalogCategoriesStore.getState().setCreateName('   ')
    const { wrapper } = createHarness()
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() => result.current.submitCreate())

    expect(CategoryService.createCategory).not.toHaveBeenCalled()
  })

  it('deletes the selected category and closes the flow after success', async () => {
    vi.mocked(CategoryService.removeCategory).mockResolvedValue({
      message: 'ok',
    })
    useCatalogCategoriesStore.getState().requestDelete({
      id: 'drinks',
      name: 'Bebidas',
      count: 0,
    } as CategoryWithCount)
    const { wrapper } = createHarness()
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() => result.current.confirmDelete())

    expect(CategoryService.removeCategory).toHaveBeenCalledWith(
      'tenant-1',
      'drinks'
    )
    expect(useCatalogCategoriesStore.getState().deleteTarget).toBeNull()
  })

  it('ignores deletion without a target and translates a constrained failure', async () => {
    const { wrapper } = createHarness()
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() => result.current.confirmDelete())
    expect(CategoryService.removeCategory).not.toHaveBeenCalled()

    vi.mocked(CategoryService.removeCategory).mockRejectedValue(
      new ApiError(400, 'has products')
    )
    act(() =>
      useCatalogCategoriesStore.getState().requestDelete({
        id: 'drinks',
        name: 'Bebidas',
        count: 0,
      } as CategoryWithCount)
    )
    await act(() => result.current.confirmDelete())

    expect(useCatalogCategoriesStore.getState().deleteError).toBe(
      CATEGORIES_HAS_PRODUCTS_HINT
    )
  })

  it('creates a category and invalidates category and menu data', async () => {
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      {} as ProductCategory
    )
    const { queryClient, wrapper } = createHarness()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() => result.current.create.mutateAsync('Bebidas'))

    expect(CategoryService.createCategory).toHaveBeenCalledWith(
      'tenant-1',
      'Bebidas'
    )
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all('tenant-1'),
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })

  it('updates and removes categories through their service contracts', async () => {
    vi.mocked(CategoryService.updateCategory).mockResolvedValue(
      {} as ProductCategory
    )
    vi.mocked(CategoryService.removeCategory).mockResolvedValue({
      message: 'ok',
    })
    const { wrapper } = createHarness()
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() =>
      result.current.update.mutateAsync({ id: 'drinks', name: 'Geladas' })
    )
    await act(() => result.current.remove.mutateAsync('drinks'))

    expect(CategoryService.updateCategory).toHaveBeenCalledWith(
      'tenant-1',
      'drinks',
      'Geladas'
    )
    expect(CategoryService.removeCategory).toHaveBeenCalledWith(
      'tenant-1',
      'drinks'
    )
  })

  it('delegates category ordering to one backend command and invalidates affected data', async () => {
    vi.mocked(CategoryService.reorderCategories).mockResolvedValue({
      message: 'ok',
    })
    const { queryClient, wrapper } = createHarness()
    const key = queryKeys.productCategories.list('tenant-1')
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () => useCatalogCategoriesMutations('tenant-1'),
      { wrapper }
    )

    await act(() =>
      result.current.reorder.mutateAsync({ ids: ['desserts', 'drinks'] })
    )

    expect(CategoryService.reorderCategories).toHaveBeenCalledWith('tenant-1', [
      'desserts',
      'drinks',
    ])
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: key })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all('tenant-1'),
    })
  })
})
