import { useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'

import { SubscriptionPlanChangeContent } from './components/SubscriptionPlanChangeContent/SubscriptionPlanChangeContent'
import { SubscriptionPlanChangeHeader } from './components/SubscriptionPlanChangeHeader/SubscriptionPlanChangeHeader'

import styles from './SubscriptionPlanChange.module.css'

export const SubscriptionPlanChange = () => {
  const { planId } = useParams()

  return (
    <Box className={styles.subscriptionPlanChangePage}>
      <SubscriptionPlanChangeHeader isConfirmation={Boolean(planId)} />
      <SubscriptionPlanChangeContent planId={planId} />
    </Box>
  )
}
