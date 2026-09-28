import { Box } from '@nino/ds/components/Box'
import headerStyles from '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader.module.css'
import stepsStyles from '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps.module.css'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'

import styles from './OrderTrackingSkeleton.module.css'

export const OrderTrackingSkeleton = () => (
  <Box
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o pedido"
  >
    <Box className={styles.shell}>
      <Box as="header" direction="row" className={headerStyles.header}>
        <Box className={headerStyles.skBack} />
        <Box className={headerStyles.skTitle} />
      </Box>
      <Box className={styles.stage} />
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
    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)
