import { Box } from '@nino/ds/components/Box'
import { PromotionsContent } from '@pages/Promotions/components/PromotionsContent/PromotionsContent'
import { PromotionsHeader } from '@pages/Promotions/components/PromotionsHeader/PromotionsHeader'
import { PromotionsLoadError } from '@pages/Promotions/components/PromotionsLoadError/PromotionsLoadError'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'
import { CampaignTableSkeleton } from '@pages/Promotions/skeletons/CampaignTableSkeleton/CampaignTableSkeleton'

import styles from './Promotions.module.css'

export const Promotions = () => {
  const { isPending, isError } = usePromotionsFacade()

  return (
    <Box className={styles.promotionsPage}>
      <PromotionsHeader />
      {isError ? (
        <PromotionsLoadError />
      ) : isPending ? (
        <CampaignTableSkeleton />
      ) : (
        <PromotionsContent />
      )}
    </Box>
  )
}
