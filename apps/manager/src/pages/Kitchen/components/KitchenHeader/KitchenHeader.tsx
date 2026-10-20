import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
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
  const { orders, isPending } = useKitchenFacade()
  const lateCount = countLateOrders(orders)

  if (isPending) {
    return (
      <Box
        as="header"
        aria-busy="true"
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ mobile: 'start', tablet: 'end' }}
        justify="between"
        className={`${motion.deal} ${styles.kitchenHeader}`}
      >
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando pedidos da cozinha
        </Text>
        <Box direction="column" gap={1} className={styles.identity}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonDescription} />
        </Box>
        <Box
          direction={{ mobile: 'column', tablet: 'row' }}
          align={{ mobile: 'start', tablet: 'center' }}
          className={styles.tally}
        >
          <Box direction="row" className={styles.metrics} aria-hidden="true">
            <Skeleton className={styles.skeletonMetric} />
            <Skeleton className={styles.skeletonMetric} />
          </Box>
          <Skeleton className={styles.skeletonAction} />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      as="header"
      direction={{ mobile: 'column', tablet: 'row' }}
      align={{ mobile: 'start', tablet: 'end' }}
      justify="between"
      className={`${motion.deal} ${styles.kitchenHeader}`}
    >
      <Header
        className={styles.identity}
        title="Cozinha"
        accent="Cozinha"
        description="Acompanhe apenas os itens que precisam de preparo."
      />

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
