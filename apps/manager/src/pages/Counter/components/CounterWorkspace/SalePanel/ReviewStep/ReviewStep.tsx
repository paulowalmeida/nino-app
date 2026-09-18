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
  subtotal: number
  deliveryFee: number
  total: number
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
  subtotal,
  deliveryFee,
  total,
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
            <Box
              as="li"
              key={line.lineId ?? line.productId}
              className={styles.ticketItem}
            >
              <Box gap={0.5}>
                <Text as="span" size="sm" className={styles.ticketName}>
                  <Text as="span" size="sm" className={styles.ticketQuantity}>
                    {line.quantity}×
                  </Text>{' '}
                  {line.name}
                </Text>
                {!!line.modifiers?.length && (
                  <Box
                    direction="column"
                    gap={0.5}
                    className={styles.modifiers}
                  >
                    {line.modifiers.map(({ optionId, name, groupName }) => (
                      <Text as="span" size="xs" color="muted" key={optionId}>
                        {groupName ? `${groupName}: ${name}` : name}
                      </Text>
                    ))}
                  </Box>
                )}
              </Box>
              <Text as="span" size="sm">
                {brl(Number(line.unitPrice) * line.quantity)}
              </Text>
            </Box>
          ))}
        </Box>

        <span className={styles.dashed} aria-hidden="true" />
        <Box direction="column" className={styles.totals}>
          {deliveryFee > 0 && (
            <>
              <Box direction="row" justify="between" align="baseline">
                <Text as="span" size="sm" color="muted">
                  Itens
                </Text>
                <Text
                  as="span"
                  size="sm"
                  color="muted"
                  className={styles.money}
                >
                  {brl(subtotal)}
                </Text>
              </Box>
              <Box direction="row" justify="between" align="baseline">
                <Text as="span" size="sm" color="muted">
                  Entrega
                </Text>
                <Text
                  as="span"
                  size="sm"
                  color="muted"
                  className={styles.money}
                >
                  {brl(deliveryFee)}
                </Text>
              </Box>
            </>
          )}
          <Box direction="row" justify="between" align="baseline">
            <Text as="span" size="sm" weight="semibold" color="muted">
              Total
            </Text>
            <Text
              as="span"
              size="2xl"
              weight="extrabold"
              font="display"
              className={styles.money}
            >
              {brl(total)}
            </Text>
          </Box>
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
