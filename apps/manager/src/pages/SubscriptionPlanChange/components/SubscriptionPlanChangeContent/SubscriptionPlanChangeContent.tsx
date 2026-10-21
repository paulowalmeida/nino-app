import { useNavigate, useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { isConsultativePlan } from '@shared/utils/subscription/isConsultativePlan/isConsultativePlan'

import { useSubscriptionPlanChangeFacade } from '../../facades/useSubscriptionPlanChangeFacade/useSubscriptionPlanChangeFacade'
import { SubscriptionPlanChoice } from '../SubscriptionPlanChoice/SubscriptionPlanChoice'
import { SubscriptionPlanConfirmation } from '../SubscriptionPlanConfirmation/SubscriptionPlanConfirmation'

type SubscriptionPlanChangeContentProps = {
  planId?: string
}

export const SubscriptionPlanChangeContent = ({
  planId,
}: SubscriptionPlanChangeContentProps) => {
  const navigate = useNavigate()
  const { unitId } = useParams()
  const {
    subscription,
    plans,
    isPending,
    isError,
    isUpdating,
    isUpdateError,
    changePlan,
  } = useSubscriptionPlanChangeFacade()
  const plansPath = `/${unitId}/assinatura/planos`
  const selectedPlan = plans.find((plan) => plan.id === planId)
  const canConfirmPlan = Boolean(
    selectedPlan &&
    subscription &&
    selectedPlan.id !== subscription.plan.id &&
    !isConsultativePlan(selectedPlan)
  )

  if (isPending) {
    return <Alert variant="info">Carregando planos disponíveis...</Alert>
  }

  if (isError || !subscription) {
    return (
      <Alert variant="error">
        Não foi possível carregar os planos disponíveis. Tente novamente.
      </Alert>
    )
  }

  if (planId && !canConfirmPlan) {
    return (
      <Box gap={4}>
        <Alert variant="error">
          Esse plano não está disponível para alteração. Escolha outro plano.
        </Alert>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(plansPath)}
        >
          Voltar para os planos
        </Button>
      </Box>
    )
  }

  if (planId && selectedPlan) {
    return (
      <SubscriptionPlanConfirmation
        currentPlan={subscription.plan}
        nextPlan={selectedPlan}
        isSubscriptionActive={subscription.isActive === true}
        isUpdating={isUpdating}
        isUpdateError={isUpdateError}
        onBack={() => navigate(plansPath)}
        onConfirm={async () => {
          await changePlan(selectedPlan.id)
          navigate(`/${unitId}/assinatura`, { replace: true })
        }}
      />
    )
  }

  return (
    <SubscriptionPlanChoice
      currentPlan={subscription.plan}
      plans={plans}
      isSubscriptionActive={subscription.isActive === true}
      onContinue={(selectedPlanId) =>
        navigate(`${plansPath}/${selectedPlanId}/confirmar`)
      }
      onRequestInterest={() => navigate(`/${unitId}/assinatura/rede`)}
    />
  )
}
