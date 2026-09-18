import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './SaleFinishActions.module.css'

export type SaleFinishActionsProps = {
  hasLines: boolean
  isPaymentAvailable: boolean
  isCash?: boolean
  total: number
  isSending: boolean
  error: string | null
  onClear: () => void
  onFinish: () => void
  bare?: boolean
}

export const SaleFinishActions = ({
  hasLines,
  isPaymentAvailable,
  isCash = false,
  total,
  isSending,
  error,
  onClear,
  onFinish,
  bare = false,
}: SaleFinishActionsProps) => {
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [confirmingCash, setConfirmingCash] = useState(false)

  const handleConfirmClear = () => {
    setConfirmingClear(false)
    onClear()
  }

  return (
    <>
      <Box className={bare ? styles.footerBare : styles.footer}>
        {hasLines && !isPaymentAvailable && (
          <Alert variant="error">
            Nenhum método de pagamento está disponível no balcão.
          </Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        <Box
          direction={bare ? 'row' : 'column'}
          align={bare ? 'center' : undefined}
          justify={bare ? 'end' : undefined}
          gap={2}
          className={styles.actions}
        >
          {hasLines && (
            <Button
              type="button"
              variant="ghost"
              disabled={isSending}
              className={styles.clear}
              onClick={() => setConfirmingClear(true)}
            >
              Limpar Pedido
            </Button>
          )}
          <Button
            loading={isSending}
            disabled={!hasLines || !isPaymentAvailable}
            className={mergeClasses(motion.press, styles.finish)}
            onClick={() => (isCash ? setConfirmingCash(true) : onFinish())}
          >
            Concluir pedido
          </Button>
        </Box>
      </Box>
      <Dialog
        open={confirmingCash && isCash}
        onOpenChange={(open) => !open && setConfirmingCash(false)}
        title="Confirmar pagamento em dinheiro"
        description={`Confirme que recebeu o pagamento de ${brl(total)} em dinheiro antes de concluir o pedido.`}
        confirmLabel="Confirmar pagamento"
        cancelLabel="Voltar"
        loading={isSending}
        onConfirm={() => {
          if (isSending || !hasLines || !isPaymentAvailable) return
          setConfirmingCash(false)
          onFinish()
        }}
        onCancel={() => setConfirmingCash(false)}
      />
      <Dialog
        open={confirmingClear}
        onOpenChange={(open) => !open && setConfirmingClear(false)}
        title="Limpar o pedido?"
        description="Os itens da venda serão removidos. Não dá para desfazer."
        confirmLabel="Limpar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmingClear(false)}
      />
    </>
  )
}
