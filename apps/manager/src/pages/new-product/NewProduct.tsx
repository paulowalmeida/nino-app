import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button, FormField, Input, Select, Textarea } from '@nino/ds'

import { BackLink } from '@components/BackLink'
import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import {
  useCategories,
  useCreateCategory,
} from '@hooks/product/useCategories'
import { useCreateMenuItem } from '@hooks/product/useCreateMenuItem'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { riseDelay } from '@utils/rise-delay'

import type { NewProductFormValues } from './NewProduct.types'

import styles from './NewProduct.module.css'
import motion from '@styles/motion.module.css'

const toPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))

export const NewProduct = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { categories, isPending: isCategoriesPending } =
    useCategories(tenantId)
  const { mutateAsync: addCategory, isPending: isAddingCategory } =
    useCreateCategory(tenantId)
  const { mutateAsync: addItem } = useCreateMenuItem(tenantId)

  const [newCategory, setNewCategory] = useState('')
  const [isNaming, setNaming] = useState(false)

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

  const options = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  const handleAddCategory = async () => {
    const name = newCategory.trim()
    if (!name) return

    const created = await addCategory(name)
    setValue('categoryId', created.id, { shouldValidate: true })
    setNewCategory('')
    setNaming(false)
  }

  const onSubmit = async (values: NewProductFormValues) => {
    try {
      const item = await addItem({
        name: values.name,
        description: values.description || undefined,
        price: toPrice(values.price),
        categoryId: values.categoryId,
      })
      void navigate(`../${item.id}`, { relative: 'path' })
    } catch {
      setError('root', {
        message: 'Não foi possível cadastrar. Confira os campos e tente de novo.',
      })
    }
  }

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <header className={styles.header}>
        <Eyebrow>Cardápio</Eyebrow>
        <PageTitle accent="item">Novo item</PageTitle>
        <p className={styles.subtitle}>
          Cadastre o essencial agora — a foto entra na tela seguinte.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(80)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              autoFocus
              placeholder="X-Tudo"
              {...register('name', { required: 'Informe o nome' })}
            />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(140)}>
          <FormField
            label="Descrição"
            helperText="Aparece abaixo do nome no app do cliente"
          >
            <Textarea rows={3} {...register('description')} />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.row}`} style={riseDelay(200)}>
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
                  placeholder={
                    isCategoriesPending ? 'Carregando…' : 'Escolha uma'
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.categoryId}
                />
              )}
            />
          </FormField>
        </div>

        <div className={`${motion.deal} ${styles.category}`} style={riseDelay(260)}>
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

        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        <div className={`${motion.deal} ${styles.actions}`} style={riseDelay(320)}>
          <Button type="submit" loading={isSubmitting}>
            Cadastrar item
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
