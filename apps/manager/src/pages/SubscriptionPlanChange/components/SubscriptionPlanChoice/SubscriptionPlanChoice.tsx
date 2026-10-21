import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import type { SubscriptionPlan } from '@shared/types/profile/subscription'
import { brl } from '@shared/utils/money/money'
import { isConsultativePlan } from '@shared/utils/subscription/isConsultativePlan/isConsultativePlan'

import styles from './SubscriptionPlanChoice.module.css'

type SubscriptionPlanChoiceProps = {
  currentPlan: SubscriptionPlan
  plans: SubscriptionPlan[]
  isSubscriptionActive: boolean
  onContinue: (planId: string) => void
  onRequestInterest: () => void
}

const formatUnits = (plan: SubscriptionPlan) =>
  plan.maxUnits === null
    ? 'Unidades ilimitadas'
    : `Até ${plan.maxUnits} ${plan.maxUnits === 1 ? 'unidade' : 'unidades'}`

export const SubscriptionPlanChoice = ({
  currentPlan,
  plans,
  isSubscriptionActive,
  onContinue,
  onRequestInterest,
}: SubscriptionPlanChoiceProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>()
  const selfServicePlans = plans.filter((plan) => !isConsultativePlan(plan))
  const consultativePlan = plans.find(isConsultativePlan)

  return (
    <Box gap={5}>
      <Box className={styles.currentPlan} gap={1}>
        <Text as="p" size="xs" weight="bold" color="muted">
          Plano atual
        </Text>
        <Box direction="row" align="center" justify="between" gap={3} wrap>
          <Text as="p" size="lg" weight="bold">
            {currentPlan.name}
          </Text>
          <Text as="p" size="sm" weight="semibold" color="strong">
            {brl(currentPlan.price)}/mês
          </Text>
        </Box>
      </Box>

      {!isSubscriptionActive && (
        <Alert variant="info">
          A troca de plano fica disponível quando a assinatura estiver ativa.
        </Alert>
      )}

      {selfServicePlans.length > 0 ? (
        <RadioGroup
          aria-label="Planos disponíveis"
          variant="card"
          value={selectedPlanId}
          onValueChange={setSelectedPlanId}
          options={selfServicePlans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan.id

            return {
              value: plan.id,
              label: isCurrentPlan ? `${plan.name} — Plano atual` : plan.name,
              description: formatUnits(plan),
              trailing: `${brl(plan.price)}/mês`,
              disabled: isCurrentPlan || !isSubscriptionActive,
            }
          })}
        />
      ) : (
        <Text as="p" size="sm" color="muted">
          Não há planos de contratação direta disponíveis no momento.
        </Text>
      )}

      {consultativePlan && (
        <Box className={styles.consultativePlan} gap={2}>
          <Box direction="row" align="center" gap={2} wrap>
            <Text as="p" size="sm" weight="bold">
              {consultativePlan.name}
            </Text>
            <Badge variant="info" size="sm">
              Sob consulta
            </Badge>
          </Box>
          <Text as="p" size="xs" color="muted">
            Contratação personalizada para operações com mais unidades e
            necessidades específicas.
          </Text>
          <Button type="button" variant="outline" onClick={onRequestInterest}>
            Solicitar proposta
          </Button>
        </Box>
      )}

      <Box className={styles.selectionFooter}>
        <Button
          type="button"
          disabled={!selectedPlanId || !isSubscriptionActive}
          onClick={() => selectedPlanId && onContinue(selectedPlanId)}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  )
}
