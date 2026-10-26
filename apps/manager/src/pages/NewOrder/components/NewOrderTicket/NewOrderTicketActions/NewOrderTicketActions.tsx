import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import motion from '@styles/motion.module.css'
import styles from './NewOrderTicketActions.module.css'

export const NewOrderTicketActions = () => {
  const { draft, availability, failed, isSubmitting, placeOrder } =
    useNewOrderFacade()
  const isDelivery = draft.channel === 'DELIVERY'

  return (
    <>
      {isDelivery && availability.closedNow && (
        <Alert variant="warning" role="status" className={motion.unroll}>
          {availability.isPaused
            ? 'A loja está fechada agora. O pedido entra assim mesmo.'
            : 'Fora do horário de entrega. O pedido entra assim mesmo.'}
        </Alert>
      )}

      {availability.missingRecipient && draft.lines.length > 0 && (
        <Text size="xs" className={styles.hint}>
          Para entregar, preencha nome, telefone, rua e região.
        </Text>
      )}

      {failed && (
        <Alert variant="error">
          Não foi possível abrir o pedido. Tente de novo.
        </Alert>
      )}

      <Button
        loading={isSubmitting}
        disabled={draft.lines.length === 0 || availability.missingRecipient}
        className={`${motion.press} ${styles.place}`}
        onClick={() => void placeOrder()}
      >
        Abrir pedido
      </Button>
    </>
  )
}
