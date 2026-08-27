import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketLines/NewOrderTicketLines.module.css'

export const NewOrderTicketLines = () => {
  const { draft } = useNewOrderFacade()

  if (draft.lines.length === 0) return null

  return (
    <Box as="ul" direction="column">
      {draft.lines.map((line) => (
        <ListRow
          key={line.productId}
          className={`${motion.deal} ${styles.line}`}
          divider="top"
          gap={2}
          padding={2}
        >
          <Text as="span" className={styles.lineName}>
            {line.name}
          </Text>
          <Box gap={1} align="center" shrink={false}>
            <Button
              size="icon"
              variant="outline"
              className={styles.stepButton}
              aria-label={`Tirar um ${line.name}`}
              onClick={() => draft.step(line.productId, -1)}
            >
              <Icon name="minus" />
            </Button>
            <Text as="span" className={styles.quantity}>
              {line.quantity}
            </Text>
            <Button
              size="icon"
              variant="outline"
              className={styles.stepButton}
              aria-label={`Mais um ${line.name}`}
              onClick={() => draft.step(line.productId, 1)}
            >
              <Icon name="plus" />
            </Button>
          </Box>
          <Text as="span" className={styles.linePrice}>
            {brl(Number(line.unitPrice) * line.quantity)}
          </Text>
        </ListRow>
      ))}
    </Box>
  )
}
