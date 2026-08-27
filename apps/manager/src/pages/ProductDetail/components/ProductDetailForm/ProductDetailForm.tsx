import { useEffect } from 'react'

import { Controller, useForm, useWatch } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { toProductFormValues } from '@pages/ProductDetail/adapters/product-detail-form.adapter/product-detail-form.adapter'
import { ProductDeleteAction } from '@pages/ProductDetail/components/ProductDetailForm/ProductDeleteAction/ProductDeleteAction'
import { ProductDetailPhoto } from '@pages/ProductDetail/components/ProductDetailForm/ProductDetailPhoto/ProductDetailPhoto'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'
import { DESCRIPTION_MAX_LENGTH } from '@shared/constants/product.constants'
import { parsedProductPrice } from '@shared/utils/parsedProductPrice/parsedProductPrice'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailForm.module.css'

const SUBMIT_ERROR = 'Não foi possível salvar. Confira os campos e tente de novo.'

export const ProductDetailForm = () => {
  const { item, categoryOptions, submitProduct, cancel } =
    useProductDetailFacade()

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductDetailFormValues>()

  const description = useWatch({ control, name: 'description' })

  useEffect(() => {
    if (!item) return
    reset(toProductFormValues(item))
  }, [item, reset])

  const onSubmit = handleSubmit(async (values) => {
    const saved = await submitProduct(values)
    if (!saved) setError('root', { message: SUBMIT_ERROR })
  })

  return (
    <Box as="form" onSubmit={onSubmit} className={styles.form}>
      <ProductDetailPhoto />

      <Box className={styles.fields}>
        <Box className={`${motion.deal} ${styles.field}`} style={riseDelay(120)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input {...register('name', { required: 'Informe o nome' })} />
          </FormField>
        </Box>

        <Box className={`${motion.deal} ${styles.field}`} style={riseDelay(180)}>
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
        </Box>

        <Box className={`${motion.deal} ${styles.row}`} style={riseDelay(240)}>
          <FormField label="Preço" error={errors.price?.message}>
            <Input
              inputMode="decimal"
              {...register('price', {
                required: 'Informe o preço',
                validate: (value) =>
                  parsedProductPrice(value) > 0 ||
                  'O preço precisa ser maior que zero',
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
        </Box>

        <Box className={`${motion.deal} ${styles.field}`} style={riseDelay(300)}>
          <FormField label="Categoria" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Escolha a categoria' }}
              render={({ field }) => (
                <Select
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.categoryId}
                />
              )}
            />
          </FormField>
        </Box>

        <Box
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
          <Box>
            <Text as="p" className={styles.availabilityLabel}>
              Disponível
            </Text>
            <Text as="p" className={styles.availabilityHint}>
              Desligado, o item some do app do cliente sem sair do cardápio.
            </Text>
          </Box>
        </Box>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
      </Box>

      <Box
        className={`${motion.deal} ${styles.actions}`}
        style={riseDelay(420)}
      >
        <ProductDeleteAction />
        <Button type="button" variant="ghost" onClick={cancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Salvar alterações
        </Button>
      </Box>
    </Box>
  )
}
