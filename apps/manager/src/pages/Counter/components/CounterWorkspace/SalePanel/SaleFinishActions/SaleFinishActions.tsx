import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Text } from '@nino/ds/components/Text'
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

  const handleConfirmClear = () => {
    setConfirmingClear(false)
    onClear()
  }

  return (
    <>
      <Box className={bare ? styles.footerBare : styles.footer}>
        <Box align="baseline" justify="between">
          <Text
            as="span"
            size="sm"
            weight="semibold"
            color="muted"
            className={styles.totalLabel}
          >
            Total
          </Text>
          <Text
            as="span"
            size="2xl"
            weight="extrabold"
            font="display"
            className={styles.total}
          >
            {brl(total)}
          </Text>
        </Box>
        {hasLines && !isPaymentAvailable && (
          <Alert variant="error">
            Nenhum método de pagamento está disponível no balcão.
          </Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        <Button
          loading={isSending}
          disabled={!hasLines || !isPaymentAvailable}
          className={mergeClasses(motion.press, styles.finish)}
          onClick={onFinish}
        >
          {isCash ? 'Confirmar recebimento e concluir pedido' : 'Concluir pedido'}
        </Button>
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
      </Box>
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
