import { useState } from 'react'

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
import { ProductCategoryCreator } from '@pages/NewProduct/components/NewProductForm/ProductCategoryCreator/ProductCategoryCreator'
import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'
import type { NewProductFormValues } from '@pages/NewProduct/types/NewProductFormValues.type'
import { ItemPhoto } from '@shared/components/ItemPhoto/ItemPhoto'
import { DESCRIPTION_MAX_LENGTH } from '@shared/constants/product.constants'
import { parsedProductPrice } from '@shared/utils/parsedProductPrice/parsedProductPrice'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './NewProductForm.module.css'

const SUBMIT_ERROR =
  'Não foi possível cadastrar. Confira os campos e tente de novo.'

export const NewProductForm = () => {
  const { categoryOptions, submitProduct, cancel } = useNewProductFacade()
  const [photo, setPhoto] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      requiresPreparation: true,
    },
  })

  const name = useWatch({ control, name: 'name' })
  const description = useWatch({ control, name: 'description' })

  const onSubmit = handleSubmit(async (values) => {
    const created = await submitProduct(values, photo)
    if (!created) setError('root', { message: SUBMIT_ERROR })
  })

  return (
    <Box as="form" onSubmit={onSubmit} className={styles.form}>
      <Box
        className={`${motion.deal} ${styles.photoCol}`}
        style={riseDelay(40)}
      >
        <ItemPhoto
          productId={null}
          name={name || 'Novo item'}
          images={[]}
          onStagedFile={setPhoto}
        />
      </Box>

      <Box className={styles.fields}>
        <Box className={`${motion.deal} ${styles.field}`} style={riseDelay(80)}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              autoFocus
              placeholder="X-Tudo"
              {...register('name', { required: 'Informe o nome' })}
            />
          </FormField>
        </Box>

        <Box
          className={`${motion.deal} ${styles.field}`}
          style={riseDelay(140)}
        >
          <FormField
            label="Descrição"
            helperText={`${description.length}/${DESCRIPTION_MAX_LENGTH} · Aparece abaixo do nome no app do cliente`}
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

        <Box className={`${motion.deal} ${styles.row}`} style={riseDelay(200)}>
          <FormField label="Preço" error={errors.price?.message}>
            <Input
              inputMode="decimal"
              placeholder="24,90"
              {...register('price', {
                required: 'Informe o preço',
                validate: (value) =>
                  parsedProductPrice(value) > 0 ||
                  'O preço precisa ser maior que zero',
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
                  options={categoryOptions}
                  placeholder="Escolha uma"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.categoryId}
                />
              )}
            />
          </FormField>
        </Box>

        <Box
          className={`${motion.deal} ${styles.category}`}
          style={riseDelay(260)}
        >
          <ProductCategoryCreator
            onCategoryCreated={(categoryId) =>
              setValue('categoryId', categoryId, { shouldValidate: true })
            }
          />
        </Box>

        <Box
          className={`${motion.deal} ${styles.preparation}`}
          style={riseDelay(300)}
        >
          <Controller
            name="requiresPreparation"
            control={control}
            render={({ field }) => (
              <FormField
                label={
                  <Box>
                    <Text as="span" className={styles.preparationLabel}>
                      Envia para a cozinha
                    </Text>
                    <Text as="span" className={styles.preparationHint}>
                      Desligue para itens prontos, como bebidas e produtos de
                      prateleira.
                    </Text>
                  </Box>
                }
                orientation="horizontal"
              >
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Envia para a cozinha"
                />
              </FormField>
            )}
          />
        </Box>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
      </Box>

      <Box
        className={`${motion.deal} ${styles.actions}`}
        style={riseDelay(360)}
      >
        <Button type="button" variant="ghost" onClick={cancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Cadastrar item
        </Button>
      </Box>
    </Box>
  )
}
