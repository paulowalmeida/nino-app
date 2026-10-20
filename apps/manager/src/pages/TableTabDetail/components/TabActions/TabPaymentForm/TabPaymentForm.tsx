import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Chip } from '@nino/ds/components/Chip'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabPaymentAmountError } from '@pages/TableTabDetail/utils/tabPaymentAmountError/tabPaymentAmountError'
import { tabPaymentRequest } from '@pages/TableTabDetail/utils/tabPaymentRequest/tabPaymentRequest'
import { tabSplitShortcuts } from '@pages/TableTabDetail/utils/tabSplitShortcuts/tabSplitShortcuts'
import { TAB_PAYMENT_OPTIONS } from '@shared/constants/tab.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { changeDue } from '@shared/utils/change-due/change-due'
import {
  brl,
  maskMoney,
  maskMoneyAmount,
  moneyValue,
} from '@shared/utils/money/money'

import styles from './TabPaymentForm.module.css'

export const TabPaymentForm = () => {
  const { tab, submitPay, isPaying } = useTableTabDetailFacade()
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [typedAmountText, setTypedAmountText] = useState<string | null>(null)
  const [receivedAmountText, setReceivedAmountText] = useState('')

  if (!tab) return null

  const amountText = typedAmountText ?? maskMoneyAmount(tab.remainingAmount)
  const amount = moneyValue(amountText)
  const amountProblem = tabPaymentAmountError(amount, tab.remainingAmount)
  const isCash = method === 'CASH'
  const received = receivedAmountText.trim()
    ? moneyValue(receivedAmountText)
    : null
  const change = changeDue(received, amount)
  const isPayable = !amountProblem && (!isCash || change.isValid)

  const resetPayment = () => {
    setMethod(null)
    setTypedAmountText(null)
    setReceivedAmountText('')
  }

  const registerPayment = (paymentMethod: PaymentMethod) =>
    submitPay(
      tabPaymentRequest(paymentMethod, amountText, receivedAmountText),
      { onSuccess: resetPayment }
    )

  return (
    <Box className={styles.tabPaymentForm}>
      <FormField
        label="Valor deste pagamento"
        helperText="Para dividir, escolha em quantas partes sai o que falta."
        error={amountProblem}
      >
        <Input
          inputMode="decimal"
          placeholder="0,00"
          value={amountText}
          onChange={(event) =>
            setTypedAmountText(maskMoney(event.target.value))
          }
        />
      </FormField>
      <Box
        role="group"
        aria-label="Dividir o que falta"
        direction="row"
        gap={2}
        className={styles.tabPaymentFormShortcuts}
      >
        {tabSplitShortcuts(tab.remainingAmount).map((shortcut) => (
          <Chip
            key={shortcut.label}
            variant="toggle"
            borderless={false}
            selected={amountText === maskMoneyAmount(shortcut.amount)}
            aria-label={`${shortcut.description}: ${brl(shortcut.amount)}`}
            onClick={() => setTypedAmountText(maskMoneyAmount(shortcut.amount))}
          >
            {shortcut.label}
          </Chip>
        ))}
      </Box>
      <RadioGroup
        aria-label="Forma de pagamento"
        options={[...TAB_PAYMENT_OPTIONS]}
        value={method ?? ''}
        onValueChange={(selectedMethod) =>
          setMethod(selectedMethod as PaymentMethod)
        }
      />
      {isCash && (
        <FormField
          label="Valor recebido"
          helperText="Deixe em branco se o cliente entregou o valor exato."
          error={change.isValid ? undefined : 'Menor que o valor a pagar.'}
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
          onClick={() => registerPayment(method)}
        >
          Registrar {brl(amount)}
        </Button>
      )}
    </Box>
  )
}
