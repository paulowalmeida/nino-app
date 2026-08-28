import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import {
  PAYMENT_METHOD_ICON,
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
} from '@shared/constants/order.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'

import motion from '@styles/motion.module.css'
import styles from './SalePaymentDetails.module.css'

export type SalePaymentDetailsProps = {
  customerName: string
  tableNumber: string
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  methods: PaymentMethod[]
  method: PaymentMethod
  onMethod: (method: PaymentMethod) => void
}

export const SalePaymentDetails = ({
  customerName,
  tableNumber,
  onCustomerName,
  onTableNumber,
  methods,
  method,
  onMethod,
}: SalePaymentDetailsProps) => (
  <Box className={styles.details}>
    <Input
      placeholder="Nome de quem pediu"
      aria-label="Nome de quem pediu"
      value={customerName}
      onChange={(event) => onCustomerName(event.target.value)}
    />
    <Input
      placeholder="Mesa ou comanda"
      aria-label="Mesa ou comanda"
      value={tableNumber}
      onChange={(event) => onTableNumber(event.target.value)}
    />
    <Text
      size="xs"
      weight="bold"
      case="uppercase"
      color="faint"
      className={styles.payLabel}
    >
      Como vai pagar
    </Text>
    <Box direction="row" wrap className={styles.choices}>
      {methods.map((value) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          aria-pressed={method === value}
          onClick={() => onMethod(value)}
          className={mergeClasses(
            motion.press,
            styles.choice,
            method === value && styles.choiceOn
          )}
        >
          <Icon name={PAYMENT_METHOD_ICON[value]} />
          {PAYMENT_METHOD_LABEL_BY_CHANNEL.COUNTER[value]}
        </Button>
      ))}
    </Box>
  </Box>
)
