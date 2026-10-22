import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { CampaignTypeModal } from '@pages/Promotions/components/PromotionsHeader/CampaignTypeModal/CampaignTypeModal'

import motion from '@styles/motion.module.css'
import styles from './PromotionsHeader.module.css'

export const PromotionsHeader = () => {
  const [isTypeOpen, setTypeOpen] = useState(false)

  return (
    <>
      <Header
        mb={{ mobile: 6, desktop: 8 }}
        className={`${motion.deal} ${styles.promotionsHeader}`}
        title="Promoções"
        accent="promoções"
        description="Campanhas que o cliente vê no cardápio e ganha no pedido."
        actions={
          <Button className={motion.press} onClick={() => setTypeOpen(true)}>
            <Icon name="plus" size="sm" />
            Nova campanha
          </Button>
        }
      />

      <CampaignTypeModal open={isTypeOpen} onOpenChange={setTypeOpen} />
    </>
  )
}
