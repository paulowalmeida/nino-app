import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { brl, maskMoney, moneyValue } from '@shared/utils/money/money'

import { useCashFacade } from '../../../facades/useCashFacade/useCashFacade'

import styles from './CashCloseModal.module.css'

export type CashCloseModalProps = {
  open: boolean
  expectedAmount: number
  onClose: () => void
}

export const CashCloseModal = ({
  open,
  expectedAmount,
  onClose,
}: CashCloseModalProps) => {
  const { submitClose, isClosing } = useCashFacade()
  const [counted, setCounted] = useState('')
  const [note, setNote] = useState('')

  const gap = counted.trim() ? moneyValue(counted) - expectedAmount : null

  const handleConfirm = () => {
    submitClose({
      countedAmount: moneyValue(counted),
      closingNote: note.trim() || undefined,
    })
    setCounted('')
    setNote('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && onClose()}
      ariaLabel="Fechar o caixa"
      header={
        <Heading level={2} size="md">
          Fechar o caixa
        </Heading>
      }
      body={
        <Box direction="column" className={styles.fields}>
          <Text size="sm" color="muted">
            Conte o dinheiro da gaveta e informe o total. O sistema espera{' '}
            {brl(expectedAmount)}.
          </Text>
          <Input
            inputMode="decimal"
            placeholder="0,00"
            aria-label="Dinheiro contado"
            value={counted}
            onChange={(event) => setCounted(maskMoney(event.target.value))}
          />
          {gap !== null && (
            <Box
              direction="row"
              justify="between"
              className={styles.difference}
            >
              <Text size="sm" weight="bold">
                Diferença
              </Text>
              <Text
                size="sm"
                weight="bold"
                color={gap === 0 ? 'brand-strong' : 'danger'}
                aria-live="polite"
              >
                {gap > 0 ? '+' : ''}
                {brl(gap)}
              </Text>
            </Box>
          )}
          <Input
            placeholder="Observação (opcional)"
            aria-label="Observação do fechamento"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Box>
      }
      footer={
        <Box direction="row" className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            loading={isClosing}
            disabled={!counted.trim()}
            onClick={handleConfirm}
          >
            Fechar caixa
          </Button>
        </Box>
      }
    />
  )
}
