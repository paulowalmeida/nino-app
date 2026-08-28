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
  changeFor: string
  changeAmount: number
  isChangeValid: boolean
  onChangeFor: (value: string) => void
  methods: readonly PaymentMethod[]
  method: PaymentMethod
  onMethod: (method: PaymentMethod) => void
}

export const SalePaymentDetails = ({
  customerName,
  tableNumber,
  onCustomerName,
  onTableNumber,
  changeFor,
  changeAmount,
  isChangeValid,
  onChangeFor,
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
    {method === 'CASH' && (
      <Box direction="column" className={styles.cashDetails}>
        <Text size="sm" weight="bold">
          Valor recebido
        </Text>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          aria-label="Valor recebido"
          value={changeFor}
          onChange={(event) => onChangeFor(event.target.value)}
        />
        <Box
          direction="row"
          justify="between"
          align="center"
          className={styles.changeSummary}
        >
          <Text size="sm" weight="bold">
            Troco
          </Text>
          <Text
            size="lg"
            weight="bold"
            color={isChangeValid ? 'brand-strong' : 'danger'}
            aria-live="polite"
          >
            {isChangeValid
              ? `R$ ${changeAmount.toFixed(2).replace('.', ',')}`
              : '—'}
          </Text>
        </Box>
        {!isChangeValid && (
          <Text size="sm" color="danger">
            Informe um valor igual ou maior que o total.
          </Text>
        )}
      </Box>
    )}
  </Box>
)
