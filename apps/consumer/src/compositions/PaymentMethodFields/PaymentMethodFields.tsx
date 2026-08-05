import { Controller, type Control, type UseFormRegister } from 'react-hook-form'

import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import { PAYMENT_METHOD_LABEL } from '@utils/order-flow'

import styles from './PaymentMethodFields.module.css'

type PaymentMethodFieldsProps = {
  control: Control<CheckoutFormValues>
  register: UseFormRegister<CheckoutFormValues>
  paymentMethod: PaymentMethod
  paymentOptions: PaymentMethod[]
}

/** Forma de pagamento na entrega, com o campo de troco só quando é dinheiro. */
export const PaymentMethodFields = ({
  control,
  register,
  paymentMethod,
  paymentOptions,
}: PaymentMethodFieldsProps) => (
  <div className={styles.block}>
    <p className={styles.blockLabel}>Pagamento na entrega</p>

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
  </div>
)
