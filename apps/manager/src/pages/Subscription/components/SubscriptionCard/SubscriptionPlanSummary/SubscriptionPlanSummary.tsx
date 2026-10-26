import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { Subscription } from '@shared/types/profile/subscription'
import { brl } from '@shared/utils/money/money'
import { isConsultativePlan } from '@shared/utils/subscription/isConsultativePlan/isConsultativePlan'

import styles from './SubscriptionPlanSummary.module.css'

type SubscriptionPlanSummaryProps = { plan: Subscription['plan'] }

export const SubscriptionPlanSummary = ({
  plan,
}: SubscriptionPlanSummaryProps) => {
  const consultative = isConsultativePlan(plan)

  return (
    <Box
      direction="row"
      wrap
      align="end"
      justify="between"
      gap={3}
      className={styles.plan}
    >
      <Box>
        <Text as="p" size="xs" weight="bold" case="uppercase" color="faint">
          Plano atual
        </Text>
        <Text
          as="p"
          size="2xl"
          weight="extrabold"
          font="display"
          color="strong"
          className={styles.planName}
        >
          {plan.name}
        </Text>
      </Box>
      <Text
        as="p"
        size="xl"
        weight="extrabold"
        font="display"
        color="brand-strong"
        className={styles.price}
      >
        {consultative ? 'Sob consulta' : brl(plan.price)}
        {!consultative && (
          <Text as="span" size="sm" weight="semibold" color="faint">
            /mês
          </Text>
        )}
      </Text>
    </Box>
  )
}
