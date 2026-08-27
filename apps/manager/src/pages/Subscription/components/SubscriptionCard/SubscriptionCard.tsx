import { Card } from '@nino/ds/components/Card'
import type { Subscription } from '@shared/types/profile/subscription'

import { SubscriptionFacts } from './SubscriptionFacts/SubscriptionFacts'
import { SubscriptionPlanSummary } from './SubscriptionPlanSummary/SubscriptionPlanSummary'
import { SubscriptionSupportHint } from './SubscriptionSupportHint/SubscriptionSupportHint'

import motion from '@styles/motion.module.css'

type SubscriptionCardProps = { subscription: Subscription }

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => (
  <Card className={motion.settle}>
    <SubscriptionPlanSummary plan={subscription.plan} />
    <SubscriptionFacts subscription={subscription} />
    <SubscriptionSupportHint />
  </Card>
)
