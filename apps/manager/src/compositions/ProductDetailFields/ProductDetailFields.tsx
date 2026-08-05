import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Switch } from '@nino/ds/components/Switch'
import { Textarea } from '@nino/ds/components/Textarea'
import { ItemPhoto } from '@compositions/ItemPhoto/ItemPhoto'
import type { MenuItem } from '@custom_types/product/menu-item'
import { riseDelay } from '@utils/rise-delay'

import styles from './ProductDetailFields.module.css'
import motion from '@styles/motion.module.css'

const DESCRIPTION_MAX_LENGTH = 300

export type ProductFormValues = {
  name: string
  description: string
  price: string
  categoryId: string
  position: number
  isActive: boolean
}

const toPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))

export type ProductDetailFieldsProps = {
  tenantId: string | null
  item: MenuItem
  categories: { value: string; label: string }[]
  description: string
  register: UseFormRegister<ProductFormValues>
  control: Control<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
}

export const ProductDetailFields = ({
  tenantId,
  item,
  categories,
  description,
  register,
  control,
  errors,
}: ProductDetailFieldsProps) => (
  <>
    <div className={`${motion.deal} ${styles.photoCol}`} style={riseDelay(80)}>
      <ItemPhoto
        tenantId={tenantId}
        productId={item.id}
        name={item.name}
        images={item.images ?? []}
      />
    </div>

    <div className={styles.fields}>
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

      <div className={`${motion.deal} ${styles.row}`} style={riseDelay(240)}>
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

        <FormField label="Posição" error={errors.position?.message}>
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

      {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
    </div>
  </>
)
