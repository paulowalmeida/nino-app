import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { PER_CUSTOMER_OPTIONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import styles from './LimitsSection.module.css'

export const LimitsSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const perCustomer = useWatch({ control, name: 'perCustomer' })

  return (
    <Box as="section" aria-labelledby="campaign-limits">
      <Card variant="flat" padding="lg" className={styles.limitsSection}>
        <Heading level={2} size="sm" id="campaign-limits">
          Limites
        </Heading>

        <Box className={styles.limitsFields}>
          <Box className={styles.perCustomer}>
            <FormField
              label="Usos por cliente"
              helperText="Cliente sem cadastro é reconhecido pelo telefone."
            >
              <Controller
                name="perCustomer"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    aria-label="Usos por cliente"
                    orientation="horizontal"
                    options={PER_CUSTOMER_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </FormField>

            {perCustomer === 'custom' && (
              <FormField
                label="Quantas vezes cada cliente"
                error={errors.perCustomerCount?.message}
              >
                <Controller
                  name="perCustomerCount"
                  control={control}
                  rules={{
                    validate: (count) =>
                      (count !== '' && count >= 2) || 'Informe 2 ou mais',
                  }}
                  render={({ field }) => (
                    <NumberInput
                      min={2}
                      value={field.value}
                      error={!!errors.perCustomerCount}
                      className={styles.perCustomerCountInput}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </FormField>
            )}
          </Box>

          <FormField
            label="Limite total de pedidos"
            helperText="Ex.: só os primeiros 50 pedidos. Vazio não limita."
            error={errors.totalLimit?.message}
          >
            <Controller
              name="totalLimit"
              control={control}
              rules={{
                validate: (limit) =>
                  limit === '' || limit >= 1 || 'Informe 1 ou mais',
              }}
              render={({ field }) => (
                <NumberInput
                  min={1}
                  placeholder="Sem limite"
                  value={field.value}
                  error={!!errors.totalLimit}
                  className={styles.totalLimitInput}
                  onValueChange={(value) =>
                    field.onChange(Number.isNaN(value) ? '' : value)
                  }
                />
              )}
            />
          </FormField>
        </Box>
      </Card>
    </Box>
  )
}
