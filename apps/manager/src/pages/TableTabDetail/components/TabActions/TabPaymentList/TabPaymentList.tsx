import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabMomentLabel } from '@pages/TableTabDetail/utils/tabMomentLabel/tabMomentLabel'
import { TAB_PAYMENT_METHOD_LABEL } from '@shared/constants/tab.constants'
import { brl } from '@shared/utils/money/money'

import styles from './TabPaymentList.module.css'

export const TabPaymentList = () => {
  const { tab } = useTableTabDetailFacade()

  if (!tab?.payments.length) return null

  return (
    <Box as="ul" aria-label="Pagamentos registrados">
      {tab.payments.map((payment) => (
        <ListRow key={payment.id} align="baseline" padding={2.5}>
          <Box className={styles.tabPaymentListMethod}>
            <Text>{TAB_PAYMENT_METHOD_LABEL[payment.method]}</Text>
            <Text size="sm" color="muted">
              {tabMomentLabel(payment.paidAt)}
            </Text>
            {payment.changeAmount !== null && payment.changeAmount > 0 && (
              <Text size="sm" color="muted">
                Troco de {brl(payment.changeAmount)}
              </Text>
            )}
          </Box>
          <Text weight="semibold" className={styles.tabPaymentListAmount}>
            {brl(payment.amount)}
          </Text>
        </ListRow>
      ))}
    </Box>
  )
}
