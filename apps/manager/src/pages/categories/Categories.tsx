import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { Reorder } from 'framer-motion'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@components/BackLink'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@hooks/product/useCategories'
import { useMenu } from '@hooks/product/useMenu'
import { useReorderCategories } from '@hooks/product/useReorderCategories'
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

/** Três linhas: o que cabe antes de rolar numa lista de categorias comum. */
const GHOST_ROWS = ['first', 'second', 'third']

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

  const { mutate: reorderCategories } = useReorderCategories(tenantId)

  const countById = new Map(
    sections.map((section) => [section.id, section.items.length])
  )
  const rows: CategoryWithCount[] = [...categories]
    .sort((a, b) => a.position - b.position)
    .map((category) => ({
      ...category,
      count: countById.get(category.id) ?? 0,
    }))

  const [order, setOrder] = useState(rows)
  const [prevRows, setPrevRows] = useState(rows)
  const orderRef = useRef(order)

  /**
   * `rows` é remontado a cada render, então comparar por referência não serve:
   * a lista só é re-semeada quando a ordem que veio da API muda de fato.
   */
  const signature = rows.map(({ id }) => id).join()
  const prevSignature = prevRows.map(({ id }) => id).join()
  if (signature !== prevSignature) {
    setPrevRows(rows)
    setOrder(rows)
  }

  useEffect(() => {
    orderRef.current = order
  }, [order])

  /**
   * As posições são fixas — o mesmo conjunto, só reatribuído. Sem isso, duas
   * categorias podem terminar com a mesma posição e a ordem no app do cliente
   * passa a depender do desempate do banco.
   */
  const persistOrder = () => {
    const slots = rows.map(({ position }) => position).sort((a, b) => a - b)
    const previousPositionById = new Map(
      rows.map(({ id, position }) => [id, position])
    )
    const changes = orderRef.current
      .map(({ id }, index) => ({ id, position: slots[index] }))
      .filter(({ id, position }) => previousPositionById.get(id) !== position)

    if (changes.length > 0) reorderCategories({ positions: changes })
  }

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

      <PageHeader
        className={`${motion.deal} ${styles.header}`}
        title="Como o cardápio se organiza"
        accent="organiza"
        description="As categorias agrupam os itens no app do cliente. Arraste para mudar a ordem em que aparecem lá."
      />

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
          {GHOST_ROWS.map((row) => (
            <div key={row} className={styles.row}>
              <Skeleton className={styles.ghostHandle} />
              <div className={styles.who}>
                <Skeleton className={styles.ghostName} />
                <Skeleton className={styles.ghostHint} />
              </div>
              <div className={styles.actions}>
                <Skeleton className={styles.ghostAction} />
                <Skeleton className={styles.ghostAction} />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar as categorias. Recarregue a página.
        </Alert>
      )}

      {!isPending && !isError && order.length === 0 && (
        <EmptyState className={motion.unroll}>
          Nenhuma categoria ainda. Crie a primeira acima — depois cadastre itens
          dentro dela.
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
              onDelete={() => openDelete(category)}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
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

      {deleteError && <Alert variant="error">{deleteError}</Alert>}
    </div>
  )
}
