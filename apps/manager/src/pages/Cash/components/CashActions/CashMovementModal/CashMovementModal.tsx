import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import type { CashMovementKind } from '@shared/types/cash/cash-movement-kind'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import { useCashFacade } from '../../../facades/useCashFacade/useCashFacade'

import styles from './CashMovementModal.module.css'

export type CashMovementModalProps = {
  open: boolean
  kind: Exclude<CashMovementKind, 'SALE'>
  onClose: () => void
}

const COPY = {
  WITHDRAWAL: {
    title: 'Registrar sangria',
    description: 'Dinheiro que saiu da gaveta e não foi troco.',
    confirm: 'Registrar sangria',
  },
  DEPOSIT: {
    title: 'Registrar suprimento',
    description: 'Dinheiro colocado na gaveta durante o expediente.',
    confirm: 'Registrar suprimento',
  },
} as const

export const CashMovementModal = ({
  open,
  kind,
  onClose,
}: CashMovementModalProps) => {
  const { submitMovement, isMoving } = useCashFacade()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    submitMovement({
      kind,
      amount: moneyValue(amount),
      reason: reason.trim() || undefined,
    })
    setAmount('')
    setReason('')
    onClose()
  }

  const copy = COPY[kind]

  return (
    <Modal
      open={open}
      onOpenChange={(open) => !open && onClose()}
      ariaLabel={copy.title}
      header={
        <Heading level={2} size="md">
          {copy.title}
        </Heading>
      }
      body={
        <Box direction="column" className={styles.cashMovementModalFields}>
          <Text size="sm" color="muted">
            {copy.description}
          </Text>
          <Input
            inputMode="decimal"
            placeholder="0,00"
            aria-label="Valor"
            value={amount}
            onChange={(event) => setAmount(maskMoney(event.target.value))}
          />
          <Input
            placeholder="Motivo (opcional)"
            aria-label="Motivo"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </Box>
      }
      footer={
        <Box direction="row" className={styles.cashMovementModalActions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            loading={isMoving}
            disabled={moneyValue(amount) <= 0}
            onClick={handleConfirm}
          >
            {copy.confirm}
          </Button>
        </Box>
      }
    />
  )
}
