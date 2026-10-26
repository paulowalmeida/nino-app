import { Header } from '@nino/ds/components/Header'
import {
  CAMPAIGN_TYPE_OPTIONS,
  EDITOR_TITLES,
} from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { BackLink } from '@shared/components/BackLink/BackLink'

import motion from '@styles/motion.module.css'
import styles from './PromotionEditorHeader.module.css'

type PromotionEditorHeaderProps = {
  campaignType?: PromotionFormValues['campaignType']
}

export const PromotionEditorHeader = ({
  campaignType,
}: PromotionEditorHeaderProps) => {
  const { mode } = usePromotionEditorFacade()
  const typeLabel = CAMPAIGN_TYPE_OPTIONS.find(
    ({ value }) => value === campaignType
  )?.label

  return (
    <>
      <BackLink>Promoções</BackLink>
      <Header
        className={`${motion.deal} ${styles.promotionEditorHeader}`}
        mb={5}
        title={
          typeLabel ? `${EDITOR_TITLES[mode]} – ${typeLabel}` : EDITOR_TITLES[mode]
        }
        accent="campanha"
        description="O cliente vê a condição no cardápio e ganha o benefício quando cumpre."
      />
    </>
  )
}
