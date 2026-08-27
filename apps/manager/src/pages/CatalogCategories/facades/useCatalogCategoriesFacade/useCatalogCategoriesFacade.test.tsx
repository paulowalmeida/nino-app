import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { catalogCategoriesFacadeMock } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade.mock'
import { useCatalogCategoriesMutations } from '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
import { useCatalogCategoriesOrder } from '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
import { useCatalogCategoriesQuery } from '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock('@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations')
vi.mock('@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder')
vi.mock('@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery')
vi.mock('@pages/CatalogCategories/states/catalog-categories/catalog-categories.store')

const clearCreateName = vi.fn()
const closeDelete = vi.fn()
const setDeleteError = vi.fn()
const createCategory = vi.fn().mockResolvedValue(undefined)
const removeCategory = vi.fn().mockResolvedValue(undefined)
const submitCreate = vi.fn().mockResolvedValue(undefined)
const confirmDelete = vi.fn().mockResolvedValue(undefined)
const reorder = vi.fn()
const setOrder = vi.fn()

const clientState = {
  createName: catalogCategoriesFacadeMock.createName,
  order: [],
  deleteTarget: catalogCategoriesFacadeMock.category,
  deleteError: null,
  setCreateName: vi.fn(),
  requestDelete: vi.fn(),
  clearCreateName,
  closeDelete,
  setDeleteError,
  setOrder,
}

describe(useCatalogCategoriesFacade.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: catalogCategoriesFacadeMock.tenantId,
    } as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useCatalogCategoriesStore).mockReturnValue(
      clientState as unknown as ReturnType<typeof useCatalogCategoriesStore>
    )
    vi.mocked(useCatalogCategoriesQuery).mockReturnValue({
      categories: [catalogCategoriesFacadeMock.category],
      rows: [catalogCategoriesFacadeMock.category],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useCatalogCategoriesQuery>)
    vi.mocked(useCatalogCategoriesMutations).mockReturnValue({
      create: { isPending: false, mutateAsync: createCategory },
      remove: { isPending: false, mutateAsync: removeCategory },
      reorder: { mutate: reorder },
      update: {
        isPending: true,
        variables: { id: catalogCategoriesFacadeMock.category.id },
        mutateAsync: vi.fn(),
      },
      submitCreate,
      confirmDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesMutations>)
    vi.mocked(useCatalogCategoriesOrder).mockReturnValue({
      order: clientState.order,
      setOrder,
      persistOrder: vi.fn(),
    })
  })

  it('exposes query, mutation, and client state through one UI boundary', () => {
    const { result } = renderHook(() => useCatalogCategoriesFacade())

    expect(useCatalogCategoriesQuery).toHaveBeenCalledWith(
      catalogCategoriesFacadeMock.tenantId
    )
    expect(useCatalogCategoriesOrder).toHaveBeenCalledWith(
      expect.any(Array),
      clientState.order,
      setOrder,
      reorder
    )
    expect(result.current).toMatchObject({
      categories: [catalogCategoriesFacadeMock.category],
      isPending: false,
      isRenaming: true,
      renamingId: catalogCategoriesFacadeMock.category.id,
      submitCreate,
      confirmDelete,
    })
  })

  it('uses a null tenant without adding fallback behavior to the facade', () => {
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    renderHook(() => useCatalogCategoriesFacade())

    expect(useCatalogCategoriesQuery).toHaveBeenCalledWith(null)
  })
})
