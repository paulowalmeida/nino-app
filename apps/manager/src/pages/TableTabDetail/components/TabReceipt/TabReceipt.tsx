import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { AddTabItemDialog } from '@pages/TableTabDetail/components/TabReceipt/AddTabItemDialog/AddTabItemDialog'
import { TabReceiptItem } from '@pages/TableTabDetail/components/TabReceipt/TabReceiptItem/TabReceiptItem'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TabReceipt.module.css'

export const TabReceipt = () => {
  const { tab } = useTableTabDetailFacade()
  const [isLaunchingItem, setLaunchingItem] = useState(false)

  if (!tab) return null

  const isOpen = tab.status === 'OPEN'

  return (
    <Card
      variant="flat"
      padding="lg"
      className={`${motion.deal} ${styles.tabReceipt}`}
    >
      <Box direction="row" justify="between" align="center" gap={3}>
        <Heading level={2} size="lg">
          Consumo
        </Heading>
        {isOpen && (
          <Button size="sm" onClick={() => setLaunchingItem(true)}>
            Lançar item
          </Button>
        )}
      </Box>
      {tab.items.length === 0 && (
        <Text color="muted" className={styles.tabReceiptEmpty}>
          Nenhum item lançado ainda.
        </Text>
      )}
      <Box as="ul" className={styles.tabReceiptItems}>
        {tab.items.map((item) => (
          <TabReceiptItem key={item.id} item={item} canCancel={isOpen} />
        ))}
      </Box>
      <Box
        direction="row"
        justify="between"
        align="center"
        className={styles.tabReceiptTotal}
      >
        <Text color="muted">Total</Text>
        <Text weight="bold" size="lg">
          {brl(tab.totalAmount)}
        </Text>
      </Box>
      <AddTabItemDialog
        open={isLaunchingItem}
        onClose={() => setLaunchingItem(false)}
      />
    </Card>
  )
}
