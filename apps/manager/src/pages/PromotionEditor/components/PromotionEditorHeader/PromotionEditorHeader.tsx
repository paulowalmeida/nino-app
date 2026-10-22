import { Header } from '@nino/ds/components/Header'
import { EDITOR_TITLES } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import { BackLink } from '@shared/components/BackLink/BackLink'

import motion from '@styles/motion.module.css'
import styles from './PromotionEditorHeader.module.css'

export const PromotionEditorHeader = () => {
  const { mode } = usePromotionEditorFacade()

  return (
    <>
      <BackLink>Promoções</BackLink>
      <Header
        className={`${motion.deal} ${styles.promotionEditorHeader}`}
        mb={5}
        title={EDITOR_TITLES[mode]}
        accent="campanha"
        description="O cliente vê a condição no cardápio e ganha o benefício quando cumpre."
      />
    </>
  )
}
