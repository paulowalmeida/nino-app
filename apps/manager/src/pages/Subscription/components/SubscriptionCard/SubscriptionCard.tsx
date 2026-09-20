import { Box } from '@nino/ds/components/Box'
import type { Subscription } from '@shared/types/profile/subscription'
import type { SubscriptionPlan } from '@shared/types/profile/subscription'

import { SubscriptionActions } from './SubscriptionActions/SubscriptionActions'
import { SubscriptionFacts } from './SubscriptionFacts/SubscriptionFacts'
import { SubscriptionPlanSummary } from './SubscriptionPlanSummary/SubscriptionPlanSummary'
import { SubscriptionSupportHint } from './SubscriptionSupportHint/SubscriptionSupportHint'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionCard.module.css'

type SubscriptionCardProps = {
  subscription: Subscription
  plans?: SubscriptionPlan[]
  isUpdating?: boolean
  onChangePlan?: (planId: string) => Promise<unknown>
  onCancel?: () => Promise<unknown>
  onRequestInterest?: () => void
}

export const SubscriptionCard = ({
  subscription,
  plans,
  isUpdating,
  onChangePlan,
  onCancel,
  onRequestInterest,
}: SubscriptionCardProps) => (
  <Box as="section" className={`${motion.settle} ${styles.subscription}`}>
    <SubscriptionPlanSummary plan={subscription.plan} />
    <SubscriptionFacts subscription={subscription} />
    {plans && onChangePlan && onCancel ? (
      <SubscriptionActions
        subscription={subscription}
        plans={plans}
        isUpdating={isUpdating ?? false}
        onChangePlan={onChangePlan}
        onCancel={onCancel}
        onRequestInterest={onRequestInterest}
      />
    ) : null}
    <SubscriptionSupportHint />
  </Box>
)
