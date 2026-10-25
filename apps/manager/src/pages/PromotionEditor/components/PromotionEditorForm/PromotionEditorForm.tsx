import { FormProvider, useForm, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Stepper } from '@nino/ds/components/Stepper'
import { toPromotionFormValues } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { BenefitSection } from '@pages/PromotionEditor/components/PromotionEditorForm/BenefitSection/BenefitSection'
import { CodeSection } from '@pages/PromotionEditor/components/PromotionEditorForm/CodeSection/CodeSection'
import { LimitsSection } from '@pages/PromotionEditor/components/PromotionEditorForm/LimitsSection/LimitsSection'
import { MediaSection } from '@pages/PromotionEditor/components/PromotionEditorForm/MediaSection/MediaSection'
import { PackageSection } from '@pages/PromotionEditor/components/PromotionEditorForm/PackageSection/PackageSection'
import { PeriodSection } from '@pages/PromotionEditor/components/PromotionEditorForm/PeriodSection/PeriodSection'
import { PromotionPreview } from '@pages/PromotionEditor/components/PromotionEditorForm/PromotionPreview/PromotionPreview'
import { ZonesSection } from '@pages/PromotionEditor/components/PromotionEditorForm/ZonesSection/ZonesSection'
import { EDITOR_SUBMIT_LABELS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import { useEditorSteps } from '@pages/PromotionEditor/hooks/ui/useEditorSteps/useEditorSteps'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import motion from '@styles/motion.module.css'
import styles from './PromotionEditorForm.module.css'

export const PromotionEditorForm = () => {
  const { mode, promotion, savePromotion, isSaving, cancel } =
    usePromotionEditorFacade()
  const form = useForm<PromotionFormValues>({
    defaultValues: toPromotionFormValues(promotion, mode),
  })
  const campaignType = useWatch({ control: form.control, name: 'campaignType' })
  const { steps, stepKey, step, isLastStep, goNext, goBack, goTo } =
    useEditorSteps(mode, form.trigger, campaignType)
  const isPackageComposition =
    stepKey === 'benefit' && campaignType === 'package'
  const isDiscountBenefit = stepKey === 'benefit' && campaignType === 'discount'

  return (
    <FormProvider {...form}>
      <Box
        as="form"
        onSubmit={form.handleSubmit((values) =>
          isLastStep
            ? savePromotion(
                values.campaignType === 'free-delivery'
                  ? { ...values, showInBanner: false }
                  : values
              )
            : void goNext()
        )}
        className={`${styles.promotionEditorForm} ${
          isPackageComposition || isLastStep
            ? ''
            : isDiscountBenefit
              ? styles.promotionEditorDiscount
              : styles.promotionEditorCompact
        }`}
      >
        <Box className={styles.promotionEditorFields}>
          <Stepper
            steps={steps}
            step={step}
            onStepChange={goTo}
            className={styles.promotionEditorStepper}
          />

          <Box
            className={`${styles.promotionEditorContent} ${
              isLastStep ? styles.promotionEditorContentReview : ''
            }`}
          >
            <Box
              key={stepKey}
              className={`${motion.deal} ${styles.promotionEditorStep}`}
            >
              {stepKey === 'benefit' && (
                <Box className={styles.promotionEditorRules}>
                  <BenefitSection />
                  {campaignType === 'package' && <PackageSection />}
                </Box>
              )}
              {stepKey === 'zones' && <ZonesSection />}
              {stepKey === 'period' && <PeriodSection />}
              {stepKey === 'rules' &&
                (campaignType === 'discount' ? (
                  <Box
                    direction="row"
                    className={styles.promotionEditorDiscountRules}
                  >
                    <Box className={styles.promotionEditorRuleColumn}>
                      <CodeSection />
                      <LimitsSection />
                    </Box>
                    <Box className={styles.promotionEditorRuleColumn}>
                      <MediaSection />
                    </Box>
                  </Box>
                ) : (
                  <Box className={styles.promotionEditorRules}>
                    {campaignType !== 'free-delivery' && <MediaSection />}
                    <LimitsSection />
                  </Box>
                ))}
            </Box>

            {isLastStep && (
              <Box className={styles.promotionEditorReview}>
                <PromotionPreview />
              </Box>
            )}
          </Box>
        </Box>

        <Box direction="row" className={styles.promotionEditorActions}>
          {step === 0 ? (
            <Button type="button" variant="ghost" onClick={cancel}>
              Cancelar
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={goBack}>
              Voltar
            </Button>
          )}
          {isLastStep ? (
            /* WHY: chaves distintas — sem elas o React reaproveita o mesmo
             * <button>, que vira type="submit" no meio do clique em
             * "Continuar" do penúltimo passo e já envia o formulário. */
            <Button key="submit" type="submit" loading={isSaving}>
              {EDITOR_SUBMIT_LABELS[mode]}
            </Button>
          ) : (
            <Button key="next" type="button" onClick={() => void goNext()}>
              Continuar
            </Button>
          )}
        </Box>
      </Box>
    </FormProvider>
  )
}
