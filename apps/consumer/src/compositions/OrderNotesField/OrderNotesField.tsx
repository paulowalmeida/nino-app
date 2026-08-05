import type { UseFormRegister } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { Textarea } from '@nino/ds/components/Textarea'
import { DisclosureTrigger } from '@elements/DisclosureTrigger/DisclosureTrigger'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'

import styles from './OrderNotesField.module.css'

type OrderNotesFieldProps = {
  register: UseFormRegister<CheckoutFormValues>
}

export const OrderNotesField = ({ register }: OrderNotesFieldProps) => (
  <Collapsible
    className={styles.disclosure}
    trigger={<DisclosureTrigger>Observação para a loja</DisclosureTrigger>}
  >
    <Textarea
      rows={3}
      placeholder="Sem cebola, ponto da carne, portaria…"
      aria-label="Observação para a loja"
      {...register('notes')}
    />
  </Collapsible>
)
