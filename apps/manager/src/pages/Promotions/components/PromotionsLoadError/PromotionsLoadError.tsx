import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import styles from './PromotionsLoadError.module.css'

export const PromotionsLoadError = () => {
  const { retry } = usePromotionsFacade()

  return (
    <EmptyState
      className={styles.promotionsLoadError}
      title="As campanhas não carregaram"
      action={<Button onClick={() => void retry()}>Tentar de novo</Button>}
    >
      Confira a conexão e tente de novo.
    </EmptyState>
  )
}
