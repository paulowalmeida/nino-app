import { usePromotionsFacade } from '@pages/Marketing/facades/usePromotionsFacade/usePromotionsFacade'

import { PromotionsContent } from './components/PromotionsContent/PromotionsContent'

export const Promotions = () => {
  const facade = usePromotionsFacade()

  return <PromotionsContent {...facade} />
}
