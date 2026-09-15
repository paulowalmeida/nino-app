import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { catalogCategoriesFacadeMock } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade.mock'
import { useCatalogCategoriesMutations } from '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
import { useCatalogCategoriesOrder } from '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
import { useCatalogCategoriesQuery } from '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCategoriesStore } from '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock(
  '@pages/CatalogCategories/hooks/useCatalogCategoriesMutations/useCatalogCategoriesMutations'
)
vi.mock(
  '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
)
vi.mock(
  '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
)
vi.mock(
  '@pages/CatalogCategories/states/catalog-categories/catalog-categories.store'
)

const clearCreateName = vi.fn()
const closeDelete = vi.fn()
const setDeleteError = vi.fn()
const createCategory = vi.fn().mockResolvedValue(undefined)
const removeCategory = vi.fn().mockResolvedValue(undefined)
const submitCreate = vi.fn().mockResolvedValue(undefined)
const confirmDelete = vi.fn().mockResolvedValue(undefined)
const submitEdit = vi.fn().mockResolvedValue(undefined)
const closeEdit = vi.fn()
const reorder = vi.fn()
const setOrder = vi.fn()

const clientState = {
  createName: catalogCategoriesFacadeMock.createName,
  order: [],
  deleteTarget: catalogCategoriesFacadeMock.category,
  deleteError: null,
  editTarget: null,
  editName: '',
  editIcon: null,
  setCreateName: vi.fn(),
  requestDelete: vi.fn(),
  clearCreateName,
  closeDelete,
  setDeleteError,
  setOrder,
  requestEdit: vi.fn(),
  setEditName: vi.fn(),
  setEditIcon: vi.fn(),
  closeEdit,
}

describe(useCatalogCategoriesFacade.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: catalogCategoriesFacadeMock.unitId,
    } as ReturnType<typeof useCurrentUnit>)
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
      update: { isPending: true, mutateAsync: vi.fn() },
      submitCreate,
      confirmDelete,
      submitEdit,
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
      catalogCategoriesFacadeMock.unitId
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
      submitCreate,
      confirmDelete,
      submitEdit,
      closeEdit,
    })
  })

  it('uses a null unit without adding fallback behavior to the facade', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    renderHook(() => useCatalogCategoriesFacade())

    expect(useCatalogCategoriesQuery).toHaveBeenCalledWith(null)
  })
})
