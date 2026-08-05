import { useState } from 'react'
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Textarea } from '@nino/ds/components/Textarea'
import { ItemPhoto } from '@compositions/ItemPhoto/ItemPhoto'
import { riseDelay } from '@utils/rise-delay'

import styles from './NewProductFields.module.css'
import motion from '@styles/motion.module.css'

const DESCRIPTION_MAX_LENGTH = 300

export type NewProductFormValues = {
  name: string
  description: string
  price: string
  categoryId: string
}

const toPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))

export type NewProductFieldsProps = {
  tenantId: string | null
  name: string
  description: string
  onStagedFile: (file: File | null) => void
  categories: { value: string; label: string }[]
  register: UseFormRegister<NewProductFormValues>
  control: Control<NewProductFormValues>
  errors: FieldErrors<NewProductFormValues>
  onAddCategory: (name: string) => Promise<{ id: string }>
  isAddingCategory: boolean
  onCategoryCreated: (categoryId: string) => void
}

export const NewProductFields = ({
  tenantId,
  name,
  description,
  onStagedFile,
  categories,
  register,
  control,
  errors,
  onAddCategory,
  isAddingCategory,
  onCategoryCreated,
}: NewProductFieldsProps) => {
  const [newCategory, setNewCategory] = useState('')
  const [isNaming, setNaming] = useState(false)

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim()
    if (!trimmed) return

    try {
      const created = await onAddCategory(trimmed)
      onCategoryCreated(created.id)
      setNewCategory('')
      setNaming(false)
    } catch {
      /* o toast de erro global avisa; o nome digitado fica no campo */
    }
  }

  return (
    <>
      <div
        className={`${motion.deal} ${styles.photoCol}`}
        style={riseDelay(40)}
      >
        <ItemPhoto
          tenantId={tenantId}
          productId={null}
          name={name || 'Novo item'}
          images={[]}
          onStagedFile={onStagedFile}
        />
      </div>

      <div className={styles.fields}>
        <div className={`${motion.deal} ${styles.field}`} style={riseDelay(80)}>
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
                  options={categories}
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
                onClick={() => void handleAddCategory()}
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
    </>
  )
}
