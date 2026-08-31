import { Controller } from 'react-hook-form'

import { FormField } from '@nino/ds/components/FormField'
import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { PAYMENT_METHOD_LABEL } from '@pages/checkout/constants/paymentMethodLabel.constants'

import styles from './PaymentMethodFields.module.css'

export const PaymentMethodFields = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const { control, register, paymentMethod, paymentOptions } =
    useCheckoutFacade(checkout)

  return (
    <Box className={styles.block}>
      <Text className={styles.blockLabel}>Pagamento na entrega</Text>

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup
            variant="card"
            orientation="horizontal"
            aria-label="Forma de pagamento"
            value={field.value}
            onValueChange={field.onChange}
            options={paymentOptions.map((method) => ({
              value: method,
              label: PAYMENT_METHOD_LABEL[method],
            }))}
          />
        )}
      />

      {paymentMethod === 'CASH' && (
        <FormField helperText="Deixe vazio se não precisar de troco">
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder="Troco para quanto?"
            aria-label="Troco para quanto"
            className={styles.noSpin}
            {...register('changeFor', { valueAsNumber: true })}
          />
        </FormField>
      )}
    </Box>
  )
}
