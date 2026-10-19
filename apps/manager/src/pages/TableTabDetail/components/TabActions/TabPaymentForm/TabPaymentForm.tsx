import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabPaymentRequest } from '@pages/TableTabDetail/utils/tabPaymentRequest/tabPaymentRequest'
import { TAB_PAYMENT_OPTIONS } from '@shared/constants/tab.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { changeDue } from '@shared/utils/change-due/change-due'
import { brl, maskMoney, moneyValue } from '@shared/utils/money/money'

import styles from './TabPaymentForm.module.css'

export const TabPaymentForm = () => {
  const { tab, submitPay, isPaying } = useTableTabDetailFacade()
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [receivedAmountText, setReceivedAmountText] = useState('')

  if (!tab) return null

  const isCash = method === 'CASH'
  const received = receivedAmountText.trim()
    ? moneyValue(receivedAmountText)
    : null
  const change = changeDue(received, tab.totalAmount)
  const isPayable = !isCash || change.isValid

  return (
    <Box className={styles.tabPaymentForm}>
      <RadioGroup
        aria-label="Forma de pagamento"
        options={[...TAB_PAYMENT_OPTIONS]}
        value={method ?? ''}
        onValueChange={(next) => setMethod(next as PaymentMethod)}
      />
      {isCash && (
        <FormField
          label="Valor recebido"
          helperText="Deixe em branco se o cliente pagou o valor exato."
          error={change.isValid ? undefined : 'Menor que o total da conta.'}
        >
          <Input
            inputMode="decimal"
            placeholder="0,00"
            value={receivedAmountText}
            onChange={(event) =>
              setReceivedAmountText(maskMoney(event.target.value))
            }
          />
        </FormField>
      )}
      {isCash && change.hasChange && change.isValid && (
        <Box
          direction="row"
          justify="between"
          className={styles.tabPaymentFormChange}
        >
          <Text size="sm" weight="bold">
            Troco
          </Text>
          <Text size="sm" weight="bold" aria-live="polite">
            {brl(change.amount)}
          </Text>
        </Box>
      )}
      {method && (
        <Button
          loading={isPaying}
          disabled={!isPayable}
          onClick={() =>
            submitPay(tabPaymentRequest(method, receivedAmountText))
          }
        >
          Registrar pagamento
        </Button>
      )}
    </Box>
  )
}
