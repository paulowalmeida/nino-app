import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'

import { SubscriptionCard } from './components/SubscriptionCard/SubscriptionCard'
import { SubscriptionHeader } from './components/SubscriptionHeader/SubscriptionHeader'
import { useSubscriptionFacade } from './facades/useSubscriptionFacade/useSubscriptionFacade'
import { SubscriptionSkeleton } from './skeletons/SubscriptionSkeleton/SubscriptionSkeleton'

import styles from './Subscription.module.css'

export const Subscription = () => {
  const navigate = useNavigate()
  const {
    subscription,
    isPending,
    isError,
    plans,
    isPlansPending,
    isPlansError,
    isUpdating,
    isUpdateError,
    changePlan,
    cancelPlan,
  } = useSubscriptionFacade()

  return (
    <Box className={styles.subscriptionPage}>
      <SubscriptionHeader />

      {isPending && <SubscriptionSkeleton />}

      {isError && (
        <Alert variant="error">
          Não foi possível carregar a assinatura agora.
        </Alert>
      )}

      {isUpdateError && (
        <Alert variant="error">
          Não foi possível atualizar a assinatura agora.
        </Alert>
      )}

      {subscription && (
        <SubscriptionCard
          subscription={subscription}
          plans={plans}
          isUpdating={isUpdating}
          onChangePlan={changePlan}
          onCancel={cancelPlan}
          onRequestInterest={() => navigate('rede')}
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
