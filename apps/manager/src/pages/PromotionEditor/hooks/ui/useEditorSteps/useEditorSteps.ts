import { useState } from 'react'

import type { UseFormTrigger } from 'react-hook-form'

import {
  EDITOR_STEP_FIELDS,
  EDITOR_STEP_TITLES,
  EDITOR_STEPS_BY_TYPE,
} from '@pages/PromotionEditor/constants/promotionEditor.constants'
import type { PromotionEditorMode } from '@pages/PromotionEditor/types/PromotionEditorMode.type'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

/* WHY: ao criar, só avança com o passo atual válido; ao editar ou duplicar,
 * todas as regras já existem e qualquer passo pode ser aberto direto. */
export const useEditorSteps = (
  mode: PromotionEditorMode,
  trigger: UseFormTrigger<PromotionFormValues>,
  campaignType: PromotionFormValues['campaignType']
) => {
  const stepKeys = EDITOR_STEPS_BY_TYPE[campaignType]
  const lastStep = stepKeys.length - 1
  const [step, setStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(
    mode === 'create' ? 0 : Infinity
  )
  const currentStep = Math.min(step, lastStep)

  const goNext = async () => {
    const isValid = await trigger([...EDITOR_STEP_FIELDS[stepKeys[currentStep]]], {
      shouldFocus: true,
    })
    if (!isValid) return
    const nextStep = Math.min(currentStep + 1, lastStep)
    setStep(nextStep)
    setFurthestStep((furthest) => Math.max(furthest, nextStep))
  }

  const goBack = () => setStep(Math.max(currentStep - 1, 0))

  const goTo = (target: number) => {
    if (target <= furthestStep) setStep(target)
  }

  return {
    steps: stepKeys.map((key) => ({ title: EDITOR_STEP_TITLES[key] })),
    stepKey: stepKeys[currentStep],
    step: currentStep,
    isLastStep: currentStep === lastStep,
    goNext,
    goBack,
    goTo,
  }
}
