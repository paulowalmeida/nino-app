import { Box } from '@nino/ds/components/Box'
import styles from '@pages/order-tracking/OrderTracking.module.css'
import headerStyles from '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader.module.css'
import stepsStyles from '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps.module.css'

/**
 * Espelha a forma real: cabeçalho com a volta e o título, o cartão vivo do
 * estágio atual e a trilha de passos — cada peça com a altura do que vai
 * substituí-la, pra não haver salto quando o pedido chega.
 */
export const OrderTrackingSkeleton = () => (
  <Box
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o pedido"
  >
    <Box as="header" className={headerStyles.header}>
      <Box className={headerStyles.skBack} />
      <Box className={headerStyles.skTitle} />
    </Box>
    <Box className={styles.skStage} />
    <Box className={stepsStyles.skJourney}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} className={stepsStyles.skRow}>
          <Box className={stepsStyles.skDot} />
          <Box className={stepsStyles.skLabel} />
          <Box className={stepsStyles.skTime} />
        </Box>
      ))}
    </Box>
  </Box>
)
