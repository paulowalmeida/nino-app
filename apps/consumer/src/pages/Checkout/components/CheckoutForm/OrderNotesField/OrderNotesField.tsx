import { Collapsible } from '@nino/ds/components/Collapsible'
import { Textarea } from '@nino/ds/components/Textarea'
import { DisclosureTrigger } from '@elements/DisclosureTrigger/DisclosureTrigger'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import styles from './OrderNotesField.module.css'

export const OrderNotesField = () => {
  const { register } = useCheckoutFacade()

  return (
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
}
