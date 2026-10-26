import { useState } from 'react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Chip } from '@nino/ds/components/Chip'
import { Combobox } from '@nino/ds/components/Combobox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { PRODUCT_SCOPE_OPTIONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import styles from './ScopeSection.module.css'

const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]

export const ScopeSection = () => {
  const { scopeCategoryOptions, scopeProductOptions } =
    usePromotionEditorFacade()
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const productScope = useWatch({ control, name: 'productScope' })
  const [productQuery, setProductQuery] = useState('')

  return (
    <Box as="section" aria-labelledby="campaign-scope">
      <Card variant="flat" padding="lg" className={styles.scopeSection}>
        <Heading level={2} size="sm" id="campaign-scope">
          Vale para
        </Heading>

        <Controller
          name="productScope"
          control={control}
          render={({ field }) => (
            <RadioGroup
              aria-label="Onde o desconto vale"
              orientation="horizontal"
              options={PRODUCT_SCOPE_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        {productScope === 'chosen' && (
          <Box className={styles.scopeChoices}>
            <Controller
              name="scopeCategoryIds"
              control={control}
              rules={{
                validate: (categoryIds) =>
                  getValues('productScope') !== 'chosen' ||
                  categoryIds.length > 0 ||
                  getValues('scopeProductIds').length > 0 ||
                  'Escolha ao menos uma categoria ou produto',
              }}
              render={({ field }) => (
                <FormField
                  label="Categorias"
                  error={errors.scopeCategoryIds?.message}
                >
                  <Box
                    direction="row"
                    role="group"
                    aria-label="Categorias com desconto"
                    className={styles.scopeChips}
                  >
                    {scopeCategoryOptions.map((category) => (
                      <Chip
                        key={category.value}
                        type="button"
                        variant="toggle"
                        selected={field.value.includes(category.value)}
                        onClick={() =>
                          field.onChange(toggleId(field.value, category.value))
                        }
                      >
                        {category.label}
                      </Chip>
                    ))}
                  </Box>
                </FormField>
              )}
            />

            <Controller
              name="scopeProductIds"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Produtos"
                  helperText="Somam com as categorias marcadas."
                >
                  <Box className={styles.scopeProducts}>
                    <Combobox
                      ariaLabel="Buscar produto"
                      placeholder="Buscar produto"
                      options={scopeProductOptions.filter(
                        ({ value }) => !field.value.includes(value)
                      )}
                      value=""
                      inputValue={productQuery}
                      onInputValueChange={setProductQuery}
                      onValueChange={(productId) => {
                        if (productId)
                          field.onChange([...field.value, productId])
                        setProductQuery('')
                      }}
                    />
                    {field.value.length > 0 && (
                      <Box direction="row" className={styles.scopeChips}>
                        {field.value.map((productId) => (
                          <Chip
                            key={productId}
                            type="button"
                            variant="toggle"
                            selected
                            aria-label={`Tirar ${scopeProductOptions.find(({ value }) => value === productId)?.label ?? 'produto'}`}
                            onClick={() =>
                              field.onChange(toggleId(field.value, productId))
                            }
                          >
                            {scopeProductOptions.find(
                              ({ value }) => value === productId
                            )?.label ?? 'Produto removido'}
                          </Chip>
                        ))}
                      </Box>
                    )}
                    {field.value.length === 0 && (
                      <Text className={styles.scopeHint}>
                        Nenhum produto avulso escolhido.
                      </Text>
                    )}
                  </Box>
                </FormField>
              )}
            />
          </Box>
        )}
      </Card>
    </Box>
  )
}
