import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

import styles from './SaleReceiptButton.module.css'

export type SaleReceiptButtonProps = {
  saleReceipt: SaleReceipt | null
  isDownloading: boolean
  onDownload: (receipt: SaleReceipt) => void
  onDismiss: () => void
}

export const SaleReceiptButton = ({
  saleReceipt,
  isDownloading,
  onDownload,
  onDismiss,
}: SaleReceiptButtonProps) => {
  if (!saleReceipt) return null

  return (
    <Box direction="row" align="center" className={styles.bar}>
      <Text size="sm" weight="semibold" className={styles.saleReceiptButtonLabel}>
        Venda #{ticketNumber(saleReceipt.orderNumber)} fechada
        {saleReceipt.pickupCode &&
          ` · Código de retirada: ${saleReceipt.pickupCode}`}
      </Text>
      <Button
        variant="outline"
        size="sm"
        loading={isDownloading}
        onClick={() => onDownload(saleReceipt)}
      >
        <Icon name="receipt" size="sm" />
        Gerar recibo
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Dispensar recibo"
        onClick={onDismiss}
      >
        <Icon name="x" size="sm" />
      </Button>
    </Box>
  )
}
