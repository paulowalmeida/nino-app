import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import {
  ProductDetailFields,
  type ProductFormValues,
} from '@compositions/ProductDetailFields/ProductDetailFields'
import { BackLink } from '@elements/BackLink/BackLink'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { useMenuItem } from '@hooks/product/useMenuItem'
import { useUpdateMenuItem } from '@hooks/product/useUpdateMenuItem'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  ProductDetailSkeleton,
} from '@skeletons/pages/ProductDetailSkeleton/ProductDetailSkeleton'
import { riseDelay } from '@utils/rise-delay'

import styles from './ProductDetail.module.css'
import motion from '@styles/motion.module.css'

const toPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))

const fromPrice = (value: string): string =>
  Number(value).toFixed(2).replace('.', ',')

export const ProductDetail = () => {
  const { productId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { item, categories, isPending } = useMenuItem(tenantId, productId)
  const { mutateAsync: save } = useUpdateMenuItem(tenantId, productId as string)
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteMenuItem(
    tenantId,
    productId as string
  )
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>()

  const description = useWatch({ control, name: 'description' })

  useEffect(() => {
    if (!item) return
    reset({
      name: item.name,
      description: item.description ?? '',
      price: fromPrice(item.price),
      categoryId: item.category.id,
      position: item.position,
      isActive: item.isActive,
    })
  }, [item, reset])

  /* O erro vira toast: a página some ao excluir e a mensagem iria junto. */
  const onDelete = async () => {
    try {
      await deleteItem()
      void navigate('..', { relative: 'path' })
    } catch {
      setIsDeleteOpen(false)
    }
  }

  if (isPending) return <ProductDetailSkeleton />

  if (!item) {
    return (
      <div className={styles.page}>
        <Alert variant="info">
          Este item não está no cardápio. Ele pode ter sido removido.
        </Alert>
        <BackLink>Cardápio</BackLink>
      </div>
    )
  }

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await save({
        name: values.name,
        description: values.description || undefined,
        price: toPrice(values.price),
        categoryId: values.categoryId,
        position: Number(values.position),
        isActive: values.isActive,
      })
      void navigate('..', { relative: 'path' })
    } catch {
      setError('root', {
        message: 'Não foi possível salvar. Confira os campos e tente de novo.',
      })
    }
  }

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <header className={`${motion.settle} ${styles.head}`}>
        <div className={styles.headText}>
          <h1 className={styles.name}>{item.name}</h1>
        </div>
        <Badge
          variant={item.isActive ? 'success' : 'error'}
          className={styles.headBadge}
        >
          {item.isActive ? 'No cardápio' : 'Fora do cardápio'}
        </Badge>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <ProductDetailFields
          tenantId={tenantId}
          item={item}
          categories={categories}
          description={description}
          register={register}
          control={control}
          errors={errors}
        />

        <div
          className={`${motion.deal} ${styles.actions}`}
          style={riseDelay(420)}
        >
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsDeleteOpen(true)}
          >
            Excluir item
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate('..', { relative: 'path' })}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Salvar alterações
          </Button>
        </div>
      </form>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir item"
        description={`"${item.name}" será removido do cardápio. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={() => void onDelete()}
        onCancel={() => setIsDeleteOpen(false)}
        loading={isDeleting}
      />
    </div>
  )
}
