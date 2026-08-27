import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ListRow } from '@nino/ds/components/ListRow'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { CartLine } from '@shared/types/counter/cart-line'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './SaleCart.module.css'

export type SaleCartProps = {
  lines: CartLine[]
  onStep: (productId: string, by: number) => void
}

export const SaleCart = ({ lines, onStep }: SaleCartProps) => {
  if (lines.length === 0) {
    return (
      <EmptyState className={styles.empty}>
        Toque nos itens para montar a venda.
      </EmptyState>
    )
  }

  return (
    <ScrollArea className={styles.linesScroll}>
      <Box as="ul" className={styles.lines}>
        {lines.map((line) => {
          const isLast = line.quantity === 1

          return (
            <ListRow
              key={line.productId}
              divider="top"
              gap={2.5}
              padding={3}
              className={mergeClasses(motion.deal, styles.line)}
            >
              <ItemThumb name={line.name} className={styles.photo} />
              <Box className={styles.lineText}>
                <Text
                  as="span"
                  size="sm"
                  weight="semibold"
                  className={styles.lineName}
                >
                  {line.name}
                </Text>
                <Text
                  as="span"
                  size="xs"
                  color="muted"
                  className={styles.lineMath}
                >
                  {line.quantity} × {brl(line.unitPrice)}
                </Text>
              </Box>
              <Box direction="column" gap={1.5} align="end" shrink={false}>
                <Text
                  as="span"
                  size="sm"
                  weight="extrabold"
                  font="display"
                  className={styles.lineTotal}
                >
                  {brl(Number(line.unitPrice) * line.quantity)}
                </Text>
                <QuantityStepper
                  quantity={line.quantity}
                  decrementIcon={isLast ? 'trash' : 'minus'}
                  decrementVariant={isLast ? 'danger' : 'outline'}
                  decrementLabel={
                    isLast
                      ? `Tirar ${line.name} da comanda`
                      : `Tirar um ${line.name}`
                  }
                  incrementLabel={`Mais um ${line.name}`}
                  onDecrement={() => onStep(line.productId, -1)}
                  onIncrement={() => onStep(line.productId, 1)}
                  size="sm"
                  className={styles.stepper}
                  count={
                    <Text
                      as="span"
                      size="sm"
                      weight="bold"
                      className={styles.stepperCount}
                    >
                      {line.quantity}
                    </Text>
                  }
                />
              </Box>
            </ListRow>
          )
        })}
      </Box>
    </ScrollArea>
  )
}
