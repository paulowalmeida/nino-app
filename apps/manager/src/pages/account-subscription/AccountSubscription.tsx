import { Alert } from '@nino/ds/components/Alert'
import { Header } from '@nino/ds/components/Header'
import {
  SubscriptionCard,
} from '@compositions/SubscriptionCard/SubscriptionCard'
import { useSubscription } from '@hooks/account/useSubscription'
import {
  SubscriptionSkeleton,
} from '@skeletons/compositions/SubscriptionSkeleton/SubscriptionSkeleton'

import styles from './AccountSubscription.module.css'

export const AccountSubscription = () => {
  const { data, isPending, isError } = useSubscription()

  return (
    <div className={styles.page}>
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

      {data && <SubscriptionCard subscription={data} />}
    </div>
  )
}
