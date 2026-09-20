import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import type {
  Subscription,
  SubscriptionPlan,
} from '@shared/types/profile/subscription'
import { brl } from '@shared/utils/money/money'

import { isConsultativePlan } from '../../../utils/isConsultativePlan/isConsultativePlan'

import styles from './SubscriptionActions.module.css'

type PendingAction =
  | { kind: 'plan'; plan: SubscriptionPlan }
  | { kind: 'cancel' }
  | null

type SubscriptionActionsProps = {
  subscription: Subscription
  plans: SubscriptionPlan[]
  isUpdating: boolean
  onChangePlan: (planId: string) => Promise<unknown>
  onCancel: () => Promise<unknown>
  onRequestInterest?: () => void
}

export const SubscriptionActions = ({
  subscription,
  plans,
  isUpdating,
  onChangePlan,
  onCancel,
  onRequestInterest,
}: SubscriptionActionsProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const selfServicePlans = plans.filter((plan) => !isConsultativePlan(plan))
  const consultativePlan = plans.find(isConsultativePlan)
  const canChangePlan = subscription.isActive === true

  const confirm = async () => {
    if (!pendingAction) return

    try {
      if (pendingAction.kind === 'plan') {
        await onChangePlan(pendingAction.plan.id)
      } else {
        await onCancel()
      }
      setPendingAction(null)
    } catch {
      // The mutation hook owns the user-facing error feedback.
    }
  }

  return (
    <Box className={styles.actions} gap={5}>
      <Box gap={2}>
        <Text as="p" size="sm" weight="bold">
          Planos disponíveis
        </Text>
        <Text as="p" size="sm" color="muted">
          Compare os limites e escolha o próximo plano da empresa. A alteração
          vale para todas as unidades.
        </Text>
        <Box as="ul" className={styles.planList}>
          {selfServicePlans.map((plan) => {
            const isCurrentPlan = plan.id === subscription.plan.id
            const unitsLabel =
              plan.maxUnits === null
                ? 'Unidades ilimitadas'
                : `Até ${plan.maxUnits} ${plan.maxUnits === 1 ? 'unidade' : 'unidades'}`

            return (
              <ListRow key={plan.id} className={styles.planRow}>
                <Box gap={1} className={styles.planDetails}>
                  <Box direction="row" align="center" gap={2} wrap>
                    <Text as="p" size="sm" weight="bold">
                      {plan.name}
                    </Text>
                    {isCurrentPlan && (
                      <Badge variant="success" size="sm">
                        Plano atual
                      </Badge>
                    )}
                  </Box>
                  <Text as="p" size="xs" color="muted">
                    {unitsLabel}
                  </Text>
                </Box>
                <Box
                  direction="row"
                  align="center"
                  justify={{ mobile: 'between', tablet: 'end' }}
                  gap={3}
                  className={styles.planDecision}
                >
                  <Text as="p" size="sm" weight="semibold" color="strong">
                    {brl(plan.price)}
                    <Text as="span" size="xs" color="muted">
                      /mês
                    </Text>
                  </Text>
                  <Button
                    type="button"
                    variant={isCurrentPlan ? 'secondary' : 'outline'}
                    disabled={isCurrentPlan || isUpdating || !canChangePlan}
                    aria-label={
                      isCurrentPlan
                        ? `Plano atual: ${plan.name}`
                        : `Trocar para o plano ${plan.name}`
                    }
                    onClick={() => setPendingAction({ kind: 'plan', plan })}
                  >
                    {isCurrentPlan ? 'Plano atual' : 'Trocar'}
                  </Button>
                </Box>
              </ListRow>
            )
          })}
        </Box>
        {!canChangePlan && (
          <Text as="p" size="xs" color="muted">
            A troca de plano fica disponível quando a assinatura estiver ativa.
          </Text>
        )}
        {selfServicePlans.length === 0 && (
          <Text as="p" size="xs" color="muted">
            Não há planos de contratação direta disponíveis no momento.
          </Text>
        )}
        {consultativePlan && (
          <Box gap={1} className={styles.consultativePlan}>
            <Box direction="row" align="center" gap={2} wrap>
              <Text as="p" size="sm" weight="bold">
                {consultativePlan.name}
              </Text>
              {consultativePlan.id === subscription.plan.id && (
                <Badge variant="success" size="sm">
                  Plano atual
                </Badge>
              )}
              <Badge variant="info" size="sm">
                Sob consulta
              </Badge>
            </Box>
            <Text as="p" size="xs" color="muted">
              Contratação personalizada para operações com mais unidades e
              necessidades específicas.
            </Text>
            {onRequestInterest && (
              <Button
                type="button"
                variant="outline"
                onClick={onRequestInterest}
                className={styles.consultativeAction}
              >
                Solicitar proposta
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Button
        type="button"
        variant="danger"
        onClick={() => setPendingAction({ kind: 'cancel' })}
        disabled={isUpdating || !subscription.isActive}
      >
        Cancelar assinatura
      </Button>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={
          pendingAction?.kind === 'cancel'
            ? 'Cancelar assinatura?'
            : 'Confirmar troca de plano'
        }
        description={
          pendingAction?.kind === 'cancel'
            ? 'A empresa perderá o acesso ao plano atual. Esta ação pode ser refeita depois por uma nova ativação.'
            : `A assinatura será alterada para ${pendingAction?.plan.name ?? ''} por ${brl(pendingAction?.plan.price)}/mês.`
        }
        confirmLabel={
          pendingAction?.kind === 'cancel'
            ? 'Cancelar assinatura'
            : 'Trocar plano'
        }
        onConfirm={() => void confirm()}
        onCancel={() => setPendingAction(null)}
        loading={isUpdating}
      />
    </Box>
  )
}
