import { Controller, useFormContext } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { maskMoney } from '@shared/utils/money/money'

import styles from './BenefitSection.module.css'

export const BenefitSection = () => {
  const { control } = useFormContext<PromotionFormValues>()

  return (
    <Box as="section" aria-labelledby="campaign-benefit">
      <Card variant="flat" padding="lg" className={styles.benefitSection}>
        <Heading level={2} size="sm" id="campaign-benefit">
          Benefício
        </Heading>
        <Text className={styles.benefitLead}>
          Frete grátis: a taxa de entrega some do pedido que cumprir a condição.
        </Text>

        <FormField
          label="Pedido mínimo"
          helperText="Conta só os itens, sem o frete. Vazio vale para qualquer pedido."
          className={styles.benefitField}
        >
          <Controller
            name="minOrderValue"
            control={control}
            render={({ field }) => (
              <Input
                inputMode="decimal"
                placeholder="60,00"
                aria-label="Pedido mínimo em reais"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(maskMoney(event.target.value))}
              />
            )}
          />
        </FormField>
      </Card>
    </Box>
  )
}
