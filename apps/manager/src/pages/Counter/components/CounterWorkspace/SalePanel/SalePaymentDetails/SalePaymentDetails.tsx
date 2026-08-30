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
import { brl, maskMoney } from '@shared/utils/money/money'

import { CashShortcuts } from './CashShortcuts/CashShortcuts'

import motion from '@styles/motion.module.css'
import styles from './SalePaymentDetails.module.css'

export type SalePaymentDetailsProps = {
  customerName: string
  onCustomerName: (name: string) => void
  changeFor: string
  changeAmount: number
  hasChange: boolean
  isChangeValid: boolean
  suggestedNotes: number[]
  onChangeFor: (value: string) => void
  methods: readonly PaymentMethod[]
  method: PaymentMethod
  onMethod: (method: PaymentMethod) => void
}

export const SalePaymentDetails = ({
  customerName,
  onCustomerName,
  changeFor,
  changeAmount,
  hasChange,
  isChangeValid,
  suggestedNotes,
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
        <CashShortcuts
          notes={suggestedNotes}
          hasChange={hasChange}
          onSelect={onChangeFor}
        />
        <Input
          inputMode="decimal"
          placeholder="0,00"
          aria-label="Valor recebido"
          value={changeFor}
          onChange={(event) => onChangeFor(maskMoney(event.target.value))}
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
            {isChangeValid && !hasChange && 'Sem troco'}
            {isChangeValid && hasChange && brl(changeAmount)}
            {!isChangeValid && '—'}
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
