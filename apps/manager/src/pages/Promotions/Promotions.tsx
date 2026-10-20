import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import { PromotionsContent } from './components/PromotionsContent/PromotionsContent'

import motion from '@styles/motion.module.css'
import styles from './Promotions.module.css'

export const Promotions = () => {
  const facade = usePromotionsFacade()

  return (
    <Box as="main" className={styles.promotionsPage}>
      <Header
        className={`${motion.deal} ${styles.promotionsHeader}`}
        size="xl"
        title="Promoções"
        description="Crie descontos e ofertas para aumentar conversão e recorrência na unidade."
      />
      <PromotionsContent {...facade} />
    </Box>
  )
}
