import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'
import { countLateOrders } from '@pages/Kitchen/utils/late-orders/late-orders'

import motion from '@styles/motion.module.css'
import styles from './KitchenHeader.module.css'

export type KitchenHeaderProps = {
  isCompact: boolean
  onToggleCompact: () => void
}

export const KitchenHeader = ({
  isCompact,
  onToggleCompact,
}: KitchenHeaderProps) => {
  const { orders } = useKitchenFacade()
  const lateCount = countLateOrders(orders)

  return (
    <Box
      as="header"
      direction={{ mobile: 'column', tablet: 'row' }}
      align={{ mobile: 'start', tablet: 'end' }}
      justify="between"
      className={`${motion.deal} ${styles.kitchenHeader}`}
    >
      <Box className={styles.identity}>
        <Heading level={1} size="xl">
          Cozinha
        </Heading>
        <Text size="sm" color="subtle">
          Acompanhe apenas os itens que precisam de preparo.
        </Text>
      </Box>

      <Box
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ mobile: 'start', tablet: 'center' }}
        className={styles.tally}
      >
        <Box direction="row" align="center" className={styles.metrics}>
          <Box className={styles.metric}>
            <Text as="span" className={styles.metricValue}>
              {orders.length}
            </Text>
            <Text as="span" className={styles.metricLabel}>
              em aberto
            </Text>
          </Box>

          <Box className={`${styles.metric} ${lateCount ? styles.alert : ''}`}>
            <Text as="span" className={styles.metricValue}>
              {lateCount}
            </Text>
            <Text as="span" className={styles.metricLabel}>
              atrasados
            </Text>
          </Box>
        </Box>

        <Button
          variant="outline"
          size="sm"
          className={`${motion.press} ${styles.density}`}
          aria-pressed={isCompact}
          onClick={onToggleCompact}
        >
          {isCompact ? 'Ver pedido inteiro' : 'Compactar pedidos'}
        </Button>
      </Box>
    </Box>
  )
}
