import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import type { SubscriptionPlan } from '@shared/types/profile/subscription'
import { brl } from '@shared/utils/money/money'

import styles from './SubscriptionPlanConfirmation.module.css'

type SubscriptionPlanConfirmationProps = {
  currentPlan: SubscriptionPlan
  nextPlan: SubscriptionPlan
  isSubscriptionActive: boolean
  isUpdating: boolean
  isUpdateError: boolean
  onBack: () => void
  onConfirm: () => Promise<void>
}

const formatUnits = (plan: SubscriptionPlan) =>
  plan.maxUnits === null
    ? 'Unidades ilimitadas'
    : `Até ${plan.maxUnits} ${plan.maxUnits === 1 ? 'unidade' : 'unidades'}`

export const SubscriptionPlanConfirmation = ({
  currentPlan,
  nextPlan,
  isSubscriptionActive,
  isUpdating,
  isUpdateError,
  onBack,
  onConfirm,
}: SubscriptionPlanConfirmationProps) => (
  <Box gap={5} aria-busy={isUpdating}>
    {isUpdateError && (
      <Alert variant="error">
        Não foi possível alterar o plano agora. Revise a escolha e tente
        novamente.
      </Alert>
    )}

    {!isSubscriptionActive && (
      <Alert variant="info">
        A troca de plano fica disponível quando a assinatura estiver ativa.
      </Alert>
    )}

    <Box className={styles.comparison} gap={3}>
      <Box gap={1}>
        <Text as="p" size="xs" weight="bold" color="muted">
          Plano atual
        </Text>
        <Text as="p" size="lg" weight="bold">
          {currentPlan.name}
        </Text>
        <Text as="p" size="sm" color="muted">
          {formatUnits(currentPlan)} · {brl(currentPlan.price)}/mês
        </Text>
      </Box>
      <Box gap={1}>
        <Text as="p" size="xs" weight="bold" color="muted">
          Novo plano
        </Text>
        <Text as="p" size="lg" weight="bold">
          {nextPlan.name}
        </Text>
        <Text as="p" size="sm" color="muted">
          {formatUnits(nextPlan)} · {brl(nextPlan.price)}/mês
        </Text>
      </Box>
    </Box>

    <Alert variant="info">
      A alteração vale para todas as unidades da empresa.
    </Alert>

    <Box direction="row" gap={3} wrap>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isUpdating}
      >
        Voltar e revisar
      </Button>
      <Button
        type="button"
        onClick={() => void onConfirm()}
        disabled={!isSubscriptionActive || isUpdating}
      >
        Confirmar alteração
      </Button>
    </Box>
  </Box>
)
