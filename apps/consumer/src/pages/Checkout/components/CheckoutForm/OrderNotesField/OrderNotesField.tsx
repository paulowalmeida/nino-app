import { Box } from '@nino/ds/components/Box'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { DisclosureTrigger } from '../DisclosureTrigger/DisclosureTrigger'

import styles from './OrderNotesField.module.css'

const ORDER_NOTES_LIMIT = 140

export const OrderNotesField = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const { register } = useCheckoutFacade(checkout)

  return (
    <Collapsible
      className={styles.disclosure}
      trigger={<DisclosureTrigger>Observação para a loja</DisclosureTrigger>}
    >
      <Textarea
        rows={3}
        placeholder="Sem cebola, ponto da carne, portaria…"
        aria-label="Observação para a loja"
        maxLength={ORDER_NOTES_LIMIT}
        {...register('notes', {
          maxLength: {
            value: ORDER_NOTES_LIMIT,
            message: `Use até ${ORDER_NOTES_LIMIT} caracteres`,
          },
        })}
      />
      <Box direction="row" justify="end">
        <Text size="xs" color="muted">
          Máximo de {ORDER_NOTES_LIMIT} caracteres
        </Text>
      </Box>
    </Collapsible>
  )
}
