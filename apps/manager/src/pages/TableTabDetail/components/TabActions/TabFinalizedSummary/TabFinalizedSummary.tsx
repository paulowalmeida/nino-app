import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabMomentLabel } from '@pages/TableTabDetail/utils/tabMomentLabel/tabMomentLabel'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import { brl } from '@shared/utils/money/money'

import styles from './TabFinalizedSummary.module.css'

export const TabFinalizedSummary = () => {
  const { tab } = useTableTabDetailFacade()

  if (!tab) return null

  const { payment, cancelledAt, cancelReason, finalizedAt } = tab

  return (
    <Box className={styles.tabFinalizedSummary}>
      {payment && (
        <>
          <Header level={2} size="lg" title="Conta paga" />
          <Box className={styles.tabFinalizedSummaryFacts}>
            <Text>{PAYMENT_METHOD_LABEL[payment.method]}</Text>
            <Text weight="bold">{brl(payment.amount)}</Text>
            {payment.changeAmount !== null && payment.changeAmount > 0 && (
              <Text size="sm" color="muted">
                Troco de {brl(payment.changeAmount)}
              </Text>
            )}
            <Text size="sm" color="muted">
              Pago em {tabMomentLabel(payment.paidAt)}
            </Text>
          </Box>
        </>
      )}
      {cancelledAt && (
        <>
          <Header level={2} size="lg" title="Comanda cancelada" />
          <Box className={styles.tabFinalizedSummaryFacts}>
            <Text>{cancelReason}</Text>
            <Text size="sm" color="muted">
              Cancelada em {tabMomentLabel(cancelledAt)}
            </Text>
          </Box>
        </>
      )}
      {finalizedAt && (
        <Text size="sm" color="muted">
          Comanda encerrada. Esta tela agora é só consulta.
        </Text>
      )}
    </Box>
  )
}
