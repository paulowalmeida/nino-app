import { FormProvider, useForm } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { toPromotionFormValues } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { BenefitSection } from '@pages/PromotionEditor/components/PromotionEditorForm/BenefitSection/BenefitSection'
import { CodeSection } from '@pages/PromotionEditor/components/PromotionEditorForm/CodeSection/CodeSection'
import { LimitsSection } from '@pages/PromotionEditor/components/PromotionEditorForm/LimitsSection/LimitsSection'
import { PeriodSection } from '@pages/PromotionEditor/components/PromotionEditorForm/PeriodSection/PeriodSection'
import { PromotionPreview } from '@pages/PromotionEditor/components/PromotionEditorForm/PromotionPreview/PromotionPreview'
import { ZonesSection } from '@pages/PromotionEditor/components/PromotionEditorForm/ZonesSection/ZonesSection'
import { EDITOR_SUBMIT_LABELS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './PromotionEditorForm.module.css'

export const PromotionEditorForm = () => {
  const { mode, promotion, savePromotion, isSaving, cancel } =
    usePromotionEditorFacade()
  const form = useForm<PromotionFormValues>({
    defaultValues: toPromotionFormValues(promotion, mode),
  })

  return (
    <FormProvider {...form}>
      <Box
        as="form"
        onSubmit={form.handleSubmit((values) => savePromotion(values))}
        className={styles.promotionEditorForm}
      >
        <Box className={styles.promotionEditorFields}>
          <Box className={motion.deal} style={riseDelay(40)}>
            <BenefitSection />
          </Box>
          <Box className={motion.deal} style={riseDelay(90)}>
            <ZonesSection />
          </Box>
          <Box className={motion.deal} style={riseDelay(140)}>
            <PeriodSection />
          </Box>
          <Box className={motion.deal} style={riseDelay(190)}>
            <CodeSection />
          </Box>
          <Box className={motion.deal} style={riseDelay(240)}>
            <LimitsSection />
          </Box>
        </Box>

        <Box
          as="aside"
          className={`${motion.deal} ${styles.promotionEditorPreview}`}
          style={riseDelay(120)}
        >
          <PromotionPreview />
        </Box>

        <Box direction="row" className={styles.promotionEditorActions}>
          <Button type="button" variant="ghost" onClick={cancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSaving}>
            {EDITOR_SUBMIT_LABELS[mode]}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
