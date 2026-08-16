import { useState } from 'react'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { CategoryRow } from '@organisms/CategoryRow/CategoryRow'
import {
  CreateCategoryForm,
} from '@organisms/CreateCategoryForm/CreateCategoryForm'
import {
  DeleteCategoryDialog,
} from '@organisms/DeleteCategoryDialog/DeleteCategoryDialog'
import { BackLink } from '@atoms/BackLink/BackLink'
import { useCategories } from '@hooks/product/useCategories'
import { useCategoryOrder } from '@hooks/product/useCategoryOrder'
import { useUpdateCategory } from '@hooks/product/useUpdateCategory'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import type {
  CategoryWithCount,
} from '@custom_types/product/category-with-count'
import { useMenu } from '@hooks/product/useMenu'
import {
  CategoryRowsSkeleton,
} from '@skeletons/organisms/CategoryRowsSkeleton/CategoryRowsSkeleton'

import styles from './Categories.module.css'
import motion from '@styles/motion.module.css'

const DESCRIPTION =
  'As categorias agrupam os itens no app do cliente. Arraste para mudar ' +
  'a ordem em que aparecem lá.'

export const Categories = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { categories, isPending, isError } = useCategories(tenantId)
  const { sections } = useMenu(tenantId)

  const {
    mutateAsync: rename,
    variables: renamingVariables,
    isPending: isRenaming,
  } = useUpdateCategory(tenantId)

  const renaming = isRenaming ? renamingVariables : undefined

  const [target, setTarget] = useState<CategoryWithCount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { order, setOrder, persistOrder } = useCategoryOrder(
    tenantId,
    categories,
    sections
  )

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <Header
        mb={{ mobile: 5, desktop: 8 }}
        mt={2}
        className={motion.deal}
        title="Como o cardápio se organiza"
        accent="organiza"
        description={DESCRIPTION}
      />

      <CreateCategoryForm tenantId={tenantId} />

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
              onDelete={() => setTarget(category)}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
      )}

      <DeleteCategoryDialog
        tenantId={tenantId}
        category={target}
        onClose={() => setTarget(null)}
        onPendingChange={setIsDeleting}
      />
    </div>
  )
}
