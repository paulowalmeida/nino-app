import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { CategoryRow } from '@organisms/CategoryRow/CategoryRow'
import { DeleteCategoryDialog } from '@organisms/DeleteCategoryDialog/DeleteCategoryDialog'
import { useCategories } from '@hooks/product/useCategories'
import { useCategoryOrder } from '@hooks/product/useCategoryOrder'
import { useDeleteCategory } from '@hooks/product/useDeleteCategory'
import { useMenu } from '@hooks/product/useMenu'
import { useUpdateCategory } from '@hooks/product/useUpdateCategory'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { ApiError } from '@nino/lib/utils/api-error'
import type { CategoryWithCount } from '@custom_types/product/category-with-count'
import { CategoryRowsSkeleton } from '@skeletons/organisms/CategoryRowsSkeleton/CategoryRowsSkeleton'

import styles from './CategoriesListContainer.module.css'
import motion from '@styles/motion.module.css'

const HAS_PRODUCTS_HINT =
  'Essa categoria ainda tem produtos. Mova ou exclua os produtos antes de ' +
  'excluir a categoria.'
const GENERIC_DELETE_ERROR = 'Não foi possível excluir. Tente de novo.'

export const CategoriesListContainer = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const navigate = useNavigate()
  const { categories, isPending, isError } = useCategories(tenantId)
  const { sections } = useMenu(tenantId)
  const {
    mutateAsync: rename,
    variables: renamingVariables,
    isPending: isRenaming,
  } = useUpdateCategory(tenantId)
  const { mutateAsync: remove, isPending: isDeleting } =
    useDeleteCategory(tenantId)
  const [target, setTarget] = useState<CategoryWithCount | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { order, setOrder, persistOrder } = useCategoryOrder(
    tenantId,
    categories,
    sections
  )
  const renaming = isRenaming ? renamingVariables : undefined

  const handleRequestDelete = (category: CategoryWithCount) => {
    setDeleteError(null)
    setTarget(category)
  }

  const handleDelete = async () => {
    if (!target) return

    try {
      await remove(target.id)
      setTarget(null)
    } catch (caught) {
      const blocked = caught instanceof ApiError && caught.status === 400
      setDeleteError(blocked ? HAS_PRODUCTS_HINT : GENERIC_DELETE_ERROR)
    }
  }

  return (
    <>
      {isPending && <CategoryRowsSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar as categorias. Recarregue a página.
        </Alert>
      )}

      {!isPending && !isError && order.length === 0 && (
        <EmptyState className={motion.unroll}>
          Nenhuma categoria ainda. Crie a primeira acima — depois cadastre
          itens dentro dela.
        </EmptyState>
      )}

      {order.length > 0 && (
        <Reorder.Group
          as="ul"
          axis="y"
          values={order}
          onReorder={setOrder}
          className={styles.list}
        >
          {order.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              index={index}
              isRenaming={renaming?.id === category.id}
              disabled={isDeleting}
              onRename={async (name) => {
                await rename({ id: category.id, name })
              }}
              onDelete={() => handleRequestDelete(category)}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
      )}

      <DeleteCategoryDialog
        category={target}
        isPending={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onViewItems={() => navigate('..', { relative: 'path' })}
        onClose={() => setTarget(null)}
      />
    </>
  )
}
