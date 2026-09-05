import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Text } from '@nino/ds/components/Text'
import type {
  Subscription,
  SubscriptionPlan,
} from '@shared/types/profile/subscription'
import { brl } from '@shared/utils/money/money'

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
}

export const SubscriptionActions = ({
  subscription,
  plans,
  isUpdating,
  onChangePlan,
  onCancel,
}: SubscriptionActionsProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const confirm = async () => {
    if (!pendingAction) return

    if (pendingAction.kind === 'plan') {
      await onChangePlan(pendingAction.plan.id)
    } else {
      await onCancel()
    }
    setPendingAction(null)
  }

  return (
    <Box className={styles.actions} gap={5}>
      <Box gap={2}>
        <Text as="p" size="sm" weight="bold">
          Trocar de plano
        </Text>
        <Text as="p" size="sm" color="muted">
          Escolha outro plano para a empresa. A alteração vale para todas as
          unidades.
        </Text>
        <Box direction="row" wrap gap={2}>
          {plans.map((plan) => (
            <Button
              key={plan.id}
              type="button"
              variant={
                plan.id === subscription.plan.id ? 'secondary' : 'outline'
              }
              disabled={plan.id === subscription.plan.id || isUpdating}
              onClick={() => setPendingAction({ kind: 'plan', plan })}
            >
              {plan.name} · {brl(plan.price)}
            </Button>
          ))}
        </Box>
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
            : `A assinatura será alterada para ${pendingAction?.plan.name ?? ''} por ${brl(pendingAction?.plan.price ?? '0')}/mês.`
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
