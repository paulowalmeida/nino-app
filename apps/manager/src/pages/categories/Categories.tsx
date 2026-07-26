import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, Dialog, Input, Skeleton } from '@nino/ds'

import { BackLink } from '@components/BackLink'
import { PageTitle } from '@components/PageTitle'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@hooks/product/useCategories'
import { useMenu } from '@hooks/product/useMenu'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { ApiError } from '@utils/api-error'
import { riseDelay } from '@utils/rise-delay'

import type { CategoryWithCount } from './Categories.types'
import { CategoryRow } from './CategoryRow'

import styles from './Categories.module.css'
import motion from '@styles/motion.module.css'

const HAS_PRODUCTS_HINT =
  'Essa categoria ainda tem produtos. Mova ou exclua os produtos antes de ' +
  'excluir a categoria.'

export const Categories = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { categories, isPending, isError } = useCategories(tenantId)
  const { sections } = useMenu(tenantId)

  const createCategory = useCreateCategory(tenantId)
  const {
    mutateAsync: rename,
    variables: renamingVariables,
    isPending: isRenaming,
  } = useUpdateCategory(tenantId)

  /* `variables` sobrevive à falha: sem o isPending o botão gira pra sempre. */
  const renaming = isRenaming ? renamingVariables : undefined
  const { mutateAsync: remove, isPending: isDeleting } =
    useDeleteCategory(tenantId)

  const [newName, setNewName] = useState('')
  const [target, setTarget] = useState<CategoryWithCount | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const countById = new Map(
    sections.map((section) => [section.id, section.items.length])
  )
  const rows: CategoryWithCount[] = [...categories]
    .sort((a, b) => a.position - b.position)
    .map((category) => ({
      ...category,
      count: countById.get(category.id) ?? 0,
    }))

  /* O toast de erro global avisa; aqui só o campo não pode se limpar à toa. */
  const addCategory = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await createCategory.mutateAsync(name)
      setNewName('')
    } catch {
      /* o nome digitado fica no campo pra pessoa tentar de novo */
    }
  }

  const openDelete = (category: CategoryWithCount) => {
    setDeleteError(null)
    setTarget(category)
  }

  const confirmDelete = async () => {
    if (!target) return
    try {
      await remove(target.id)
      setTarget(null)
    } catch (error) {
      const blocked = error instanceof ApiError && error.status === 400
      setDeleteError(
        blocked ? HAS_PRODUCTS_HINT : 'Não foi possível excluir. Tente de novo.'
      )
    }
  }

  const hasProducts = !!target && target.count > 0

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <header className={`${motion.deal} ${styles.header}`}>
        <PageTitle accent="organiza">Como o cardápio se organiza</PageTitle>
        <p className={styles.subtitle}>
          As categorias agrupam os itens no app do cliente. A ordem em que
          aparecem você ajusta arrastando no próprio cardápio.
        </p>
      </header>

      <form
        className={`${motion.deal} ${styles.create}`}
        style={riseDelay(40)}
        onSubmit={(event) => {
          event.preventDefault()
          void addCategory()
        }}
      >
        <Input
          value={newName}
          placeholder="Nova categoria — ex.: Sobremesas"
          aria-label="Nome da nova categoria"
          onChange={(event) => setNewName(event.target.value)}
        />
        <Button
          type="submit"
          className={motion.press}
          loading={createCategory.isPending}
          disabled={!newName.trim()}
        >
          Adicionar
        </Button>
      </form>

      {isPending && (
        <div className={styles.loading}>
          <Skeleton className={styles.skeletonRow} />
          <Skeleton className={styles.skeletonRow} />
          <Skeleton className={styles.skeletonRow} />
        </div>
      )}

      {isError && (
        <p className={styles.notice}>
          Não foi possível carregar as categorias. Recarregue a página.
        </p>
      )}

      {!isPending && !isError && rows.length === 0 && (
        <p className={`${motion.unroll} ${styles.notice}`}>
          Nenhuma categoria ainda. Crie a primeira acima — depois cadastre itens
          dentro dela.
        </p>
      )}

      {rows.length > 0 && (
        <ul className={styles.list}>
          {rows.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              index={index}
              isRenaming={renaming?.id === category.id}
              disabled={isDeleting}
              onRename={async (name) => {
                await rename({ id: category.id, name })
              }}
              onDelete={() => openDelete(category)}
            />
          ))}
        </ul>
      )}

      {target && hasProducts && (
        <Dialog
          open
          onOpenChange={(open) => !open && setTarget(null)}
          title="Ainda não dá para excluir"
          description={HAS_PRODUCTS_HINT}
          confirmLabel="Ver itens no cardápio"
          cancelLabel="Fechar"
          onConfirm={() => void navigate('..', { relative: 'path' })}
          onCancel={() => setTarget(null)}
        />
      )}

      {target && !hasProducts && (
        <Dialog
          open
          onOpenChange={(open) => !open && setTarget(null)}
          title={`Excluir "${target.name}"`}
          description="A categoria sai do painel e do app. Não dá para desfazer."
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          loading={isDeleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setTarget(null)}
        />
      )}

      {deleteError && <p className={styles.notice}>{deleteError}</p>}
    </div>
  )
}
