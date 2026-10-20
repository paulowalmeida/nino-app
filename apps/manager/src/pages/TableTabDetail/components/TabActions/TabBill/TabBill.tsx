import { Box } from '@nino/ds/components/Box'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { TabPaymentList } from '@pages/TableTabDetail/components/TabActions/TabPaymentList/TabPaymentList'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { brl } from '@shared/utils/money/money'

import styles from './TabBill.module.css'

export const TabBill = () => {
  const { tab, storeServiceFeePercent, submitServiceFee, isSettingServiceFee } =
    useTableTabDetailFacade()

  if (!tab) return null

  const isServiceFeeApplied = tab.serviceFeeAmount > 0
  const hasServiceFeeChoice = isServiceFeeApplied || storeServiceFeePercent > 0
  const shownServiceFeePercent = isServiceFeeApplied
    ? tab.serviceFeePercent
    : storeServiceFeePercent
  const hasPayments = tab.payments.length > 0
  const serviceFeeLabel = `Serviço (${shownServiceFeePercent}%)`

  return (
    <Box className={styles.tabBill}>
      <Box className={styles.tabBillLines}>
        <Box direction="row" justify="between" align="baseline">
          <Text color="muted">Consumo</Text>
          <Text className={styles.tabBillAmount}>{brl(tab.subtotal)}</Text>
        </Box>
        {hasServiceFeeChoice && (
          <Box direction="row" justify="between" align="center" gap={3}>
            <Box direction="row" align="center" gap={2}>
              <Switch
                size="sm"
                checked={isServiceFeeApplied}
                disabled={hasPayments || isSettingServiceFee}
                onCheckedChange={(applied) => submitServiceFee({ applied })}
                aria-label={serviceFeeLabel}
              />
              <Text color="muted">{serviceFeeLabel}</Text>
            </Box>
            <Text className={styles.tabBillAmount}>
              {isServiceFeeApplied ? brl(tab.serviceFeeAmount) : 'Recusado'}
            </Text>
          </Box>
        )}
        <Box
          direction="row"
          justify="between"
          align="baseline"
          className={styles.tabBillTotal}
        >
          <Text weight="semibold">Total</Text>
          <Text weight="semibold" className={styles.tabBillAmount}>
            {brl(tab.totalAmount)}
          </Text>
        </Box>
      </Box>
      <TabPaymentList />
      <Box
        direction="row"
        justify="between"
        align="baseline"
        className={styles.tabBillRemaining}
      >
        <Text weight="semibold">Falta pagar</Text>
        <Text
          size="3xl"
          weight="bold"
          aria-live="polite"
          className={styles.tabBillAmount}
        >
          {brl(tab.remainingAmount)}
        </Text>
      </Box>
      {hasPayments && hasServiceFeeChoice && (
        <Text size="sm" color="muted">
          Com pagamento registrado, a taxa de serviço não muda mais.
        </Text>
      )}
    </Box>
  )
}
