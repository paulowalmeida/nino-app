import { Box } from '@nino/ds/components/Box'
import type { Subscription } from '@shared/types/profile/subscription'

import { SubscriptionFacts } from './SubscriptionFacts/SubscriptionFacts'
import { SubscriptionPlanSummary } from './SubscriptionPlanSummary/SubscriptionPlanSummary'
import { SubscriptionSupportHint } from './SubscriptionSupportHint/SubscriptionSupportHint'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionCard.module.css'

type SubscriptionCardProps = { subscription: Subscription }

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => (
  <Box as="section" className={`${motion.settle} ${styles.subscription}`}>
    <SubscriptionPlanSummary plan={subscription.plan} />
    <SubscriptionFacts subscription={subscription} />
    <SubscriptionSupportHint />
  </Box>
)
