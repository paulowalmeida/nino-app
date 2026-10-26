import { Box } from '@nino/ds/components/Box'
import type { Subscription } from '@shared/types/profile/subscription'

import { SubscriptionActions } from './SubscriptionActions/SubscriptionActions'
import { SubscriptionFacts } from './SubscriptionFacts/SubscriptionFacts'
import { SubscriptionPlanSummary } from './SubscriptionPlanSummary/SubscriptionPlanSummary'
import { SubscriptionSupportHint } from './SubscriptionSupportHint/SubscriptionSupportHint'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionCard.module.css'

type SubscriptionCardProps = {
  subscription: Subscription
  isUpdating?: boolean
  onManagePlan?: () => void
  onCancel?: () => Promise<unknown>
}

export const SubscriptionCard = ({
  subscription,
  isUpdating,
  onManagePlan,
  onCancel,
}: SubscriptionCardProps) => (
  <Box as="section" className={`${motion.deal} ${styles.subscription}`}>
    <SubscriptionPlanSummary plan={subscription.plan} />
    <SubscriptionFacts subscription={subscription} />
    {onManagePlan && onCancel ? (
      <SubscriptionActions
        subscription={subscription}
        isUpdating={isUpdating ?? false}
        onManagePlan={onManagePlan}
        onCancel={onCancel}
      />
    ) : null}
    <SubscriptionSupportHint />
  </Box>
)
