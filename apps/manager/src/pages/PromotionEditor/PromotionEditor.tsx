import { Box } from '@nino/ds/components/Box'
import { PromotionEditorForm } from '@pages/PromotionEditor/components/PromotionEditorForm/PromotionEditorForm'
import { PromotionEditorHeader } from '@pages/PromotionEditor/components/PromotionEditorHeader/PromotionEditorHeader'
import { PromotionUnavailable } from '@pages/PromotionEditor/components/PromotionUnavailable/PromotionUnavailable'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import { PromotionEditorSkeleton } from '@pages/PromotionEditor/skeletons/PromotionEditorSkeleton/PromotionEditorSkeleton'

import styles from './PromotionEditor.module.css'

export const PromotionEditor = () => {
  const { isPending, isUnavailable } = usePromotionEditorFacade()

  return (
    <Box className={styles.promotionEditorPage}>
      {/* WHY: o tipo escolhido vive no formulário, então é ele quem monta o
       * cabeçalho quando está na tela. */}
      {isUnavailable || isPending ? (
        <>
          <PromotionEditorHeader />
          {isUnavailable ? <PromotionUnavailable /> : <PromotionEditorSkeleton />}
        </>
      ) : (
        <PromotionEditorForm />
      )}
    </Box>
  )
}
