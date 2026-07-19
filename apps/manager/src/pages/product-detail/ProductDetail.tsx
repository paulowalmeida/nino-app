import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'

import { Button, FormField, Input, Select, Switch, Textarea } from '@nino/ds'

import { ItemThumb } from '@components/ItemThumb'
import { useMenuItem } from '@hooks/product/useMenuItem'
import { useUpdateMenuItem } from '@hooks/product/useUpdateMenuItem'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { riseDelay } from '@utils/rise-delay'

import type { ProductFormValues } from './ProductDetail.types'

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>()

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

  if (isPending) return <p className={styles.notice}>Carregando…</p>

  if (!item) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>
          Este item não está no cardápio. Ele pode ter sido removido.
        </p>
        <Link to=".." relative="path" className={styles.backLink}>
          Voltar ao cardápio
        </Link>
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
      <Link to=".." relative="path" className={styles.backLink}>
        ← Cardápio
      </Link>

      <header className={`${motion.settle} ${styles.header}`}>
        <ItemThumb
          name={item.name}
          className={`${motion.pop} ${styles.thumb}`}
        />
        <div>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.breadcrumb}>{item.category.name}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input {...register('name', { required: 'Informe o nome' })} />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(180)}>
          <FormField
            label="Descrição"
            helperText="Aparece abaixo do nome no app do cliente"
          >
            <Textarea rows={3} {...register('description')} />
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
        </div>
      </form>
    </div>
  )
}
