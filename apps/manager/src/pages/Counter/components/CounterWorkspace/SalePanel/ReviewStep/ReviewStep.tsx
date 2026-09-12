import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { counterPrintedRows } from '@pages/Counter/utils/counterPrintedRows/counterPrintedRows'
import type { CartLine } from '@shared/types/counter/cart-line'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { Recipient } from '@shared/types/order/recipient'
import { brl } from '@shared/utils/money/money'

import styles from './ReviewStep.module.css'

type ReviewStepProps = {
  lines: CartLine[]
  channel: OrderChannel | null
  consumerName: string
  tableNumber: string
  recipient: Recipient
  method: PaymentMethod | null
  changeFor: string
  changeAmount: number
}

export const ReviewStep = ({
  lines,
  channel,
  consumerName,
  tableNumber,
  recipient,
  method,
  changeFor,
  changeAmount,
}: ReviewStepProps) => {
  const printedRows = counterPrintedRows({
    channel,
    consumerName,
    tableNumber,
    recipient,
    method,
    changeFor,
    changeAmount,
  })

  return (
    <Box direction="column" className={styles.step}>
      <Box direction="column" className={styles.ticket}>
        <Box direction="column" as="ul" className={styles.ticketItems}>
          {lines.map((line) => (
            <Box as="li" key={line.productId} className={styles.ticketItem}>
              <Text as="span" size="sm" className={styles.ticketName}>
                <Text as="span" size="sm" className={styles.ticketQuantity}>
                  {line.quantity}×
                </Text>{' '}
                {line.name}
              </Text>
              <Text as="span" size="sm">
                {brl(Number(line.unitPrice) * line.quantity)}
              </Text>
            </Box>
          ))}
        </Box>

        {printedRows.length > 0 && (
          <>
            <span className={styles.dashed} aria-hidden="true" />
            <Box direction="column" className={styles.printed}>
              {printedRows.map(({ label, value }) => (
                <Box
                  direction="column"
                  key={label}
                  className={styles.printedRow}
                >
                  <Text as="span" className={styles.microLabel}>
                    {label}
                  </Text>
                  <Text as="span" className={styles.printedValue}>
                    {value}
                  </Text>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
