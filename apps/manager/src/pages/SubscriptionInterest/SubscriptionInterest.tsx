import { Box } from '@nino/ds/components/Box'

import { SubscriptionInterestHeader } from './components/SubscriptionInterestHeader/SubscriptionInterestHeader'
import { SubscriptionInterestRequest } from './components/SubscriptionInterestRequest/SubscriptionInterestRequest'

import styles from './SubscriptionInterest.module.css'

export const SubscriptionInterest = () => (
  <Box className={styles.subscriptionInterestPage}>
    <SubscriptionInterestHeader />
    <SubscriptionInterestRequest />
  </Box>
)
