import { useEffect } from 'react'

import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Switch } from '@nino/ds/components/Switch'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { toProductFormValues } from '@pages/ProductDetail/adapters/product-detail-form.adapter/product-detail-form.adapter'
import { ProductDeleteAction } from '@pages/ProductDetail/components/ProductDetailForm/ProductDeleteAction/ProductDeleteAction'
import { ProductDetailPhoto } from '@pages/ProductDetail/components/ProductDetailForm/ProductDetailPhoto/ProductDetailPhoto'
import { ProductModifierEditor } from '@pages/ProductDetail/components/ProductDetailForm/ProductModifierEditor/ProductModifierEditor'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'
import { DESCRIPTION_MAX_LENGTH } from '@shared/constants/product.constants'
import { parsedProductPrice } from '@shared/utils/parsedProductPrice/parsedProductPrice'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailForm.module.css'

const SUBMIT_ERROR =
  'Não foi possível salvar. Confira os campos e tente de novo.'

export const ProductDetailForm = () => {
  const { item, categoryOptions, submitProduct, cancel } =
    useProductDetailFacade()

  const form = useForm<ProductDetailFormValues>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = form

  const description = useWatch({ control, name: 'description' })
  const pricingType = useWatch({ control, name: 'pricingType' })

  useEffect(() => {
    if (!item) return
    reset(toProductFormValues(item))
  }, [item, reset])

  const onSubmit = handleSubmit(async (values) => {
    const saved = await submitProduct(values)
    if (!saved) setError('root', { message: SUBMIT_ERROR })
  })

  return (
    <FormProvider {...form}>
      <Box as="form" onSubmit={onSubmit} className={styles.form}>
        <Box className={styles.fields}>
          <Tabs
            className={styles.tabs}
            tabs={[
              {
                value: 'information',
                label: 'Informações',
                content: (
                  <Box
                    className={`${styles.tabContent} ${styles.informationLayout}`}
                  >
                    <ProductDetailPhoto />

                    <Box className={styles.informationFields}>
                      <Box
                        className={`${motion.deal} ${styles.field}`}
                        style={riseDelay(120)}
                      >
                        <FormField label="Nome" error={errors.name?.message}>
                          <Input
                            {...register('name', {
                              required: 'Informe o nome',
                            })}
                          />
                        </FormField>
                      </Box>

                      <Box
                        className={`${motion.deal} ${styles.field}`}
                        style={riseDelay(180)}
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
                      </Box>

                      <Box
                        className={`${motion.deal} ${styles.field}`}
                        style={riseDelay(220)}
                      >
                        <FormField
                          label="Categoria"
                          error={errors.categoryId?.message}
                        >
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
                    </Box>
                  </Box>
                ),
              },
              {
                value: 'pricing',
                label: 'Preço',
                content: (
                  <Box className={styles.tabContent}>
                    <Box
                      className={`${motion.deal} ${styles.pricing}`}
                      style={riseDelay(240)}
                    >
                      <FormField
                        label="Modelo de preço"
                        error={errors.pricingType?.message}
                      >
                        <Controller
                          name="pricingType"
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={[
                                {
                                  value: 'FIXED',
                                  label: 'Preço fixo + adicionais',
                                },
                                {
                                  value: 'COMPOSED',
                                  label: 'Soma das escolhas',
                                },
                              ]}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          )}
                        />
                      </FormField>

                      <FormField label="Preço" error={errors.price?.message}>
                        <Input
                          inputMode="decimal"
                          disabled={pricingType === 'COMPOSED'}
                          {...register('price', {
                            required:
                              pricingType === 'COMPOSED'
                                ? false
                                : 'Informe o preço',
                            validate: (value) =>
                              pricingType === 'COMPOSED' ||
                              parsedProductPrice(value) > 0 ||
                              'O preço precisa ser maior que zero',
                          })}
                        />
                      </FormField>

                      <Text as="p" className={styles.pricingHint}>
                        {pricingType === 'COMPOSED'
                          ? 'O total será a soma das escolhas de composição e dos adicionais.'
                          : 'O preço do item será somado somente aos adicionais escolhidos.'}
                      </Text>
                    </Box>
                  </Box>
                ),
              },
              {
                value: 'composition',
                label: 'Composição',
                content: (
                  <Box className={styles.tabContent}>
                    <ProductModifierEditor />
                  </Box>
                ),
              },
              {
                value: 'operation',
                label: 'Operação',
                content: (
                  <Box className={styles.tabContent}>
                    <Box
                      className={`${motion.deal} ${styles.row}`}
                      style={riseDelay(280)}
                    >
                      <FormField
                        label="Posição"
                        error={errors.position?.message}
                      >
                        <Input
                          type="number"
                          min={0}
                          {...register('position', { valueAsNumber: true })}
                        />
                      </FormField>
                    </Box>

                    <Box
                      className={`${motion.deal} ${styles.availability}`}
                      style={riseDelay(320)}
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
                          Desligado, o item some do app do cliente sem sair do
                          cardápio.
                        </Text>
                      </Box>
                    </Box>

                    <FormField
                      className={`${motion.deal} ${styles.availability}`}
                      label={
                        <Box>
                          <Text as="span" className={styles.availabilityLabel}>
                            Envia para a cozinha
                          </Text>
                          <Text as="span" className={styles.availabilityHint}>
                            Desligue para itens prontos, como bebidas e produtos
                            de prateleira.
                          </Text>
                        </Box>
                      }
                      orientation="horizontal"
                    >
                      <Controller
                        name="requiresPreparation"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label="Envia para a cozinha"
                          />
                        )}
                      />
                    </FormField>
                  </Box>
                ),
              },
            ]}
          />

          {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
        </Box>

        <Box
          className={`${motion.deal} ${styles.actions}`}
          style={riseDelay(460)}
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
    </FormProvider>
  )
}
