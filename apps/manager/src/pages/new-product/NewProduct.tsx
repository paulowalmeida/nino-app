import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useQueryClient } from '@tanstack/react-query'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Select } from '@nino/ds/components/Select'
import { Textarea } from '@nino/ds/components/Textarea'
import { toast } from '@nino/ds/components/Toast'
import { ItemPhoto } from '@compositions/ItemPhoto/ItemPhoto'
import { BackLink } from '@elements/BackLink/BackLink'
import { useCategories, useCreateCategory } from '@hooks/product/useCategories'
import { useCreateMenuItem } from '@hooks/product/useCreateMenuItem'
import { menuQueryKey } from '@hooks/product/useMenu'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { ProductService } from '@services/product.service'
import { riseDelay } from '@utils/rise-delay'

import { NewProductSkeleton } from './NewProductSkeleton'
import type { NewProductFormValues } from './NewProduct.types'

import styles from './NewProduct.module.css'
import motion from '@styles/motion.module.css'

const toPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))

const DESCRIPTION_MAX_LENGTH = 300

export const NewProduct = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { categories, isPending: isCategoriesPending } = useCategories(tenantId)
  const { mutateAsync: addCategory, isPending: isAddingCategory } =
    useCreateCategory(tenantId)
  const { mutateAsync: addItem } = useCreateMenuItem(tenantId)

  const [newCategory, setNewCategory] = useState('')
  const [isNaming, setNaming] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormValues>({
    defaultValues: { name: '', description: '', price: '', categoryId: '' },
  })

  const name = useWatch({ control, name: 'name' })
  const description = useWatch({ control, name: 'description' })

  const options = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  if (isCategoriesPending) return <NewProductSkeleton />

  const handleAddCategory = async () => {
    const name = newCategory.trim()
    if (!name) return

    try {
      const created = await addCategory(name)
      setValue('categoryId', created.id, { shouldValidate: true })
      setNewCategory('')
      setNaming(false)
    } catch {
      /* o toast de erro global avisa; o nome digitado fica no campo */
    }
  }

  const onSubmit = async (values: NewProductFormValues) => {
    try {
      const item = await addItem({
        name: values.name,
        description: values.description || undefined,
        price: toPrice(values.price),
        categoryId: values.categoryId,
      })

      if (photoFile) {
        try {
          await ProductService.uploadItemImage(tenantId as string, item.id, photoFile)
          void queryClient.invalidateQueries({
            queryKey: menuQueryKey(tenantId),
          })
        } catch {
          /* O item já foi criado: avisar da foto é melhor que falhar tudo. */
          toast.warning(
            'Item criado, mas a foto não subiu',
            'Abra o item no cardápio e envie a foto de novo.'
          )
        }
      }

      void navigate('..', { relative: 'path' })
    } catch {
      setError('root', {
        message:
          'Não foi possível cadastrar. Confira os campos e tente de novo.',
      })
    }
  }

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <PageHeader
        className={styles.header}
        title="Novo item"
        accent="item"
        description="O que o cliente vê no cardápio, tudo em um lugar só."
      />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={`${motion.deal} ${styles.photoCol}`} style={riseDelay(40)}>
          <ItemPhoto
            tenantId={tenantId}
            productId={null}
            name={name || 'Novo item'}
            images={[]}
            onStagedFile={setPhotoFile}
          />
        </div>

        <div className={styles.fields}>
          <div
            className={`${motion.deal} ${styles.field}`}
            style={riseDelay(80)}
          >
            <FormField label="Nome" error={errors.name?.message}>
              <Input
                autoFocus
                placeholder="X-Tudo"
                {...register('name', { required: 'Informe o nome' })}
              />
            </FormField>
          </div>

          <div
            className={`${motion.deal} ${styles.field}`}
            style={riseDelay(140)}
          >
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
            style={riseDelay(200)}
          >
            <FormField label="Preço" error={errors.price?.message}>
              <Input
                inputMode="decimal"
                placeholder="24,90"
                {...register('price', {
                  required: 'Informe o preço',
                  validate: (value) =>
                    toPrice(value) > 0 || 'O preço precisa ser maior que zero',
                })}
              />
            </FormField>

            <FormField label="Categoria" error={errors.categoryId?.message}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: 'Escolha a categoria' }}
                render={({ field }) => (
                  <Select
                    options={options}
                    placeholder="Escolha uma"
                    value={field.value}
                    onValueChange={field.onChange}
                    error={!!errors.categoryId}
                  />
                )}
              />
            </FormField>
          </div>

          <div
            className={`${motion.deal} ${styles.category}`}
            style={riseDelay(260)}
          >
            {!isNaming && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={motion.press}
                onClick={() => setNaming(true)}
              >
                Criar uma categoria
              </Button>
            )}

            {isNaming && (
              <div className={`${motion.unroll} ${styles.categoryBox}`}>
                <Input
                  autoFocus
                  placeholder="Lanches"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  loading={isAddingCategory}
                  disabled={!newCategory.trim()}
                  className={motion.press}
                  onClick={handleAddCategory}
                >
                  Criar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setNaming(false)}
                >
                  Voltar
                </Button>
              </div>
            )}
          </div>

          {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
        </div>

        <div
          className={`${motion.deal} ${styles.actions}`}
          style={riseDelay(320)}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate('..', { relative: 'path' })}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Cadastrar item
          </Button>
        </div>
      </form>
    </div>
  )
}
