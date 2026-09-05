import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'

import { SubscriptionCard } from './components/SubscriptionCard/SubscriptionCard'
import { useSubscriptionFacade } from './facades/useSubscriptionFacade/useSubscriptionFacade'
import { SubscriptionSkeleton } from './skeletons/SubscriptionSkeleton/SubscriptionSkeleton'

import styles from './Subscription.module.css'

export const Subscription = () => {
  const {
    subscription,
    isPending,
    isError,
    plans,
    isPlansPending,
    isPlansError,
    isUpdating,
    changePlan,
    cancelPlan,
  } = useSubscriptionFacade()

  return (
    <Box className={styles.page}>
      <Header
        mb={{ mobile: 5, desktop: 8 }}
        title="Assinatura e plano"
        accent="plano"
        description="A assinatura é da empresa e vale para todas as unidades."
      />

      {isPending && <SubscriptionSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a assinatura agora.
        </Alert>
      )}

      {subscription && (
        <SubscriptionCard
          subscription={subscription}
          plans={plans}
          isUpdating={isUpdating}
          onChangePlan={changePlan}
          onCancel={cancelPlan}
        />
      )}
      {isPlansError && (
        <Alert variant="error">
          Não foi possível carregar os planos disponíveis.
        </Alert>
      )}
      {isPlansPending && !isPending && (
        <Alert variant="info">Carregando planos disponíveis...</Alert>
      )}
    </Box>
  )
}
