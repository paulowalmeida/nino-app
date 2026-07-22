import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import {
  Button,
  Dialog,
  FormField,
  Input,
  Select,
  Skeleton,
  Switch,
  Textarea,
} from '@nino/ds'

import { ItemPhoto } from '@compositions/ItemPhoto'
import { BackLink } from '@components/BackLink'
import { ItemThumb } from '@components/ItemThumb'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { useMenuItem } from '@hooks/product/useMenuItem'
import { useUpdateMenuItem } from '@hooks/product/useUpdateMenuItem'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { riseDelay } from '@utils/rise-delay'

import type { ProductFormValues } from './ProductDetail.types'

import styles from './ProductDetail.module.css'
import motion from '@styles/motion.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const DESCRIPTION_MAX_LENGTH = 300

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
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const onDelete = async () => {
    try {
      await deleteItem()
      void navigate('..', { relative: 'path' })
    } catch {
      setDeleteError('Não foi possível excluir. Tente de novo.')
    }
  }

  if (isPending) {
    return (
      <div className={styles.page}>
        <Skeleton className={styles.skeleton} />
      </div>
    )
  }

  if (!item) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>
          Este item não está no cardápio. Ele pode ter sido removido.
        </p>
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

      <header className={`${motion.settle} ${styles.hero}`}>
        <div className={styles.heroInner}>
          <ItemThumb
            name={item.name}
            imageUrl={item.images?.[0]?.url}
            className={`${motion.pop} ${styles.thumb}`}
          />
          <div className={styles.heroText}>
            <p className={styles.category}>{item.category.name}</p>
            <h1 className={styles.name}>{item.name}</h1>
            <p className={styles.heroPrice}>{brl.format(+item.price)}</p>
          </div>
          <span
            className={
              item.isActive
                ? styles.heroBadge
                : `${styles.heroBadge} ${styles.heroBadgeOff}`
            }
          >
            {item.isActive ? 'No cardápio' : 'Fora do cardápio'}
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(80)}>
          <ItemPhoto
            tenantId={tenantId}
            productId={item.id}
            name={item.name}
            images={item.images ?? []}
          />
        </div>

        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input {...register('name', { required: 'Informe o nome' })} />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(180)}>
          <FormField
            label="Descrição"
            helperText={`${description?.length ?? 0}/${DESCRIPTION_MAX_LENGTH} · Aparece abaixo do nome no app do cliente`}
            error={errors.description?.message}
          >
            <Textarea
              rows={3}
              maxLength={DESCRIPTION_MAX_LENGTH}
              {...register('description', {
                maxLength: {
                  value: DESCRIPTION_MAX_LENGTH,
                  message: `A descrição não pode passar de ${DESCRIPTION_MAX_LENGTH} caracteres`,
                },
              })}
            />
          </FormField>
        </div>

        <div
          className={`${motion.deal} ${styles.row}`}
          style={riseDelay(240)}
        >
          <FormField label="Preço" error={errors.price?.message}>
            <Input
              inputMode="decimal"
              {...register('price', {
                required: 'Informe o preço',
                validate: (value) =>
                  toPrice(value) > 0 || 'O preço precisa ser maior que zero',
              })}
            />
          </FormField>

          <FormField
            label="Posição"
            helperText="Ordem dentro da categoria"
            error={errors.position?.message}
          >
            <Input
              type="number"
              min={0}
              {...register('position', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(300)}>
          <FormField label="Categoria" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Escolha a categoria' }}
              render={({ field }) => (
                <Select
                  options={categories}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.categoryId}
                />
              )}
            />
          </FormField>
        </div>

        <div
          className={`${motion.deal} ${styles.availability}`}
          style={riseDelay(360)}
        >
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Item disponível"
              />
            )}
          />
          <div>
            <p className={styles.availabilityLabel}>Disponível</p>
            <p className={styles.availabilityHint}>
              Desligado, o item some do app do cliente sem sair do cardápio.
            </p>
          </div>
        </div>

        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        <div
          className={`${motion.deal} ${styles.actions}`}
          style={riseDelay(420)}
        >
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Salvar alterações
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate('..', { relative: 'path' })}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsDeleteOpen(true)}
          >
            Excluir item
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

      {deleteError && <p className={styles.error}>{deleteError}</p>}
    </div>
  )
}
