import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { tabItemTotal } from '@pages/TableTabDetail/utils/tabItemTotal/tabItemTotal'
import type { TabItem } from '@shared/types/tab/tab-item'
import { brl } from '@shared/utils/money/money'

import styles from './TabReceiptItem.module.css'

type TabReceiptItemProps = {
  item: TabItem
  canCancel: boolean
}

export const TabReceiptItem = ({ item, canCancel }: TabReceiptItemProps) => {
  const { submitCancelItem, isCancellingItem } = useTableTabDetailFacade()
  const [isConfirmingCancel, setConfirmingCancel] = useState(false)
  const showCancel = canCancel && !item.isCancelled

  const cancelItem = () => {
    submitCancelItem(item.id)
    setConfirmingCancel(false)
  }

  return (
    <ListRow
      divider="bottom"
      padding={3}
      className={item.isCancelled ? styles.tabReceiptItemCancelled : undefined}
    >
      <Box direction="row" justify="between" align="start" gap={3} grow>
        <Box className={styles.tabReceiptItemInfo}>
          <Text weight="bold">{item.productName}</Text>
          <Text size="sm" color="muted">
            {item.quantity} × {brl(item.unitPrice)}
          </Text>
          {item.modifiers.map((modifier) => (
            <Text key={modifier.id} size="sm" color="muted">
              + {modifier.name}
              {modifier.quantity > 1 ? ` × ${modifier.quantity}` : ''}
            </Text>
          ))}
          {item.notes && (
            <Text size="sm" color="muted">
              {item.notes}
            </Text>
          )}
          {item.isCancelled && (
            <Text size="sm" color="danger">
              Item cancelado
            </Text>
          )}
        </Box>
        <Box className={styles.tabReceiptItemEnd}>
          <Text weight="bold" color={item.isCancelled ? 'muted' : undefined}>
            {brl(tabItemTotal(item))}
          </Text>
          {showCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingCancel(true)}
            >
              Cancelar item
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={isConfirmingCancel}
        onOpenChange={(open) => !open && setConfirmingCancel(false)}
        title="Cancelar este item?"
        description={`${item.productName} sai da comanda e o total é recalculado.`}
        confirmLabel="Cancelar item"
        cancelLabel="Voltar"
        onConfirm={cancelItem}
        onCancel={() => setConfirmingCancel(false)}
        loading={isCancellingItem}
      />
    </ListRow>
  )
}
