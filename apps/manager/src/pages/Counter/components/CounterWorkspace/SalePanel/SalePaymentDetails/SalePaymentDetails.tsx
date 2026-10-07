import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import {
  PAYMENT_METHOD_ICON,
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
} from '@shared/constants/order.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { brl, maskMoney } from '@shared/utils/money/money'

import { ChoiceCard } from '../ChoiceCard/ChoiceCard'
import { CashShortcuts } from './CashShortcuts/CashShortcuts'

import styles from './SalePaymentDetails.module.css'

export type SalePaymentDetailsProps = {
  changeFor: string
  changeAmount: number
  hasChange: boolean
  isChangeValid: boolean
  suggestedNotes: number[]
  onChangeFor: (value: string) => void
  methods: readonly PaymentMethod[]
  method: PaymentMethod | null
  onMethod: (method: PaymentMethod) => void
}

export const SalePaymentDetails = ({
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
  <Box className={styles.salePaymentDetails}>
    <Box className={styles.choices}>
      {methods.map((value) => (
        <ChoiceCard
          key={value}
          icon={<Icon name={PAYMENT_METHOD_ICON[value]} />}
          label={PAYMENT_METHOD_LABEL_BY_CHANNEL.COUNTER[value]}
          isSelected={method === value}
          onSelect={() => onMethod(value)}
        />
      ))}
    </Box>
    {method === 'CASH' && (
      <Box direction="column" className={styles.cashDetails}>
        <Box direction="column" className={styles.salePaymentDetailsField}>
          <Text as="span" className={styles.fieldLabel}>
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
        </Box>
        {changeFor ? (
          <Box
            direction="row"
            justify="between"
            align="baseline"
            className={styles.change}
          >
            <Text as="span" size="sm" weight="bold">
              Troco
            </Text>
            <Text
              as="span"
              color={isChangeValid ? 'brand-strong' : 'danger'}
              className={styles.changeValue}
              aria-live="polite"
            >
              {isChangeValid && !hasChange && 'Sem troco'}
              {isChangeValid && hasChange && brl(changeAmount)}
              {!isChangeValid && '—'}
            </Text>
          </Box>
        ) : (
          <Text as="p" size="xs" color="muted" className={styles.salePaymentDetailsNote}>
            Escolha quanto o cliente entregou e o troco aparece aqui.
          </Text>
        )}
        {!isChangeValid && (
          <Text size="sm" color="danger">
            Informe um valor igual ou maior que o total.
          </Text>
        )}
      </Box>
    )}
  </Box>
)
