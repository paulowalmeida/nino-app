import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { TabPaymentList } from '@pages/TableTabDetail/components/TabActions/TabPaymentList/TabPaymentList'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabMomentLabel } from '@pages/TableTabDetail/utils/tabMomentLabel/tabMomentLabel'
import { brl } from '@shared/utils/money/money'

import styles from './TabFinalizedSummary.module.css'

export const TabFinalizedSummary = () => {
  const { tab } = useTableTabDetailFacade()

  if (!tab) return null

  const { payments, cancelledAt, cancelReason, finalizedAt } = tab

  return (
    <Box className={styles.tabFinalizedSummary}>
      {payments.length > 0 && (
        <>
          <Header level={2} size="lg" title="Conta paga" />
          <Box className={styles.tabFinalizedSummaryFacts}>
            <Box direction="row" justify="between" align="baseline">
              <Text color="muted">Consumo</Text>
              <Text className={styles.tabFinalizedSummaryAmount}>
                {brl(tab.subtotal)}
              </Text>
            </Box>
            {tab.serviceFeeAmount > 0 && (
              <Box direction="row" justify="between" align="baseline">
                <Text color="muted">Serviço ({tab.serviceFeePercent}%)</Text>
                <Text className={styles.tabFinalizedSummaryAmount}>
                  {brl(tab.serviceFeeAmount)}
                </Text>
              </Box>
            )}
            <Box direction="row" justify="between" align="baseline">
              <Text weight="bold">Total pago</Text>
              <Text weight="bold" className={styles.tabFinalizedSummaryAmount}>
                {brl(tab.paidAmount)}
              </Text>
            </Box>
          </Box>
          <TabPaymentList />
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
