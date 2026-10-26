import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Text } from '@nino/ds/components/Text'
import type { Subscription } from '@shared/types/profile/subscription'

import styles from './SubscriptionActions.module.css'

type SubscriptionActionsProps = {
  subscription: Subscription
  isUpdating: boolean
  onManagePlan: () => void
  onCancel: () => Promise<unknown>
}

export const SubscriptionActions = ({
  subscription,
  isUpdating,
  onManagePlan,
  onCancel,
}: SubscriptionActionsProps) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const confirm = async () => {
    try {
      await onCancel()
      setIsCancelDialogOpen(false)
    } catch {
      // The mutation hook owns the user-facing error feedback.
    }
  }

  return (
    <Box className={styles.subscriptionActions} gap={5}>
      <Box gap={3}>
        <Box gap={1}>
          <Text as="p" size="sm" weight="bold">
            Gerenciar plano
          </Text>
          <Text as="p" size="sm" color="muted">
            Compare os planos disponíveis antes de confirmar a alteração.
          </Text>
        </Box>
        <Button
          type="button"
          onClick={onManagePlan}
          disabled={!subscription.isActive || isUpdating}
        >
          Alterar plano
        </Button>
        {!subscription.isActive && (
          <Text as="p" size="xs" color="muted">
            A troca de plano fica disponível quando a assinatura estiver ativa.
          </Text>
        )}
      </Box>

      <Box className={styles.cancellation} gap={2}>
        <Text as="p" size="sm" weight="bold">
          Encerrar assinatura
        </Text>
        <Text as="p" size="xs" color="muted">
          Esta ação encerra o acesso ao plano atual da empresa.
        </Text>
        <Button
          type="button"
          variant="danger"
          className={styles.cancelAction}
          onClick={() => setIsCancelDialogOpen(true)}
          disabled={isUpdating || !subscription.isActive}
        >
          Cancelar assinatura
        </Button>
      </Box>

      <Dialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => !open && setIsCancelDialogOpen(false)}
        title="Cancelar assinatura?"
        description="A empresa perderá o acesso ao plano atual. Esta ação pode ser refeita depois por uma nova ativação."
        confirmLabel="Cancelar assinatura"
        onConfirm={() => void confirm()}
        onCancel={() => setIsCancelDialogOpen(false)}
        loading={isUpdating}
      />
    </Box>
  )
}
