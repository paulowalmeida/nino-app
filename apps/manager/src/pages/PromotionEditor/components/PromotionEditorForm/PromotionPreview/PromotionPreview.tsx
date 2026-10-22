import { useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Icon } from '@nino/ds/components/Icon'
import { Separator } from '@nino/ds/components/Separator'
import { Text } from '@nino/ds/components/Text'
import { toPromotionSummarySource } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { promotionLimitsLabel } from '@pages/PromotionEditor/utils/promotionLimitsLabel/promotionLimitsLabel'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

import styles from './PromotionPreview.module.css'

const PREVIEW_ICONS = {
  'free-delivery': 'truck',
  discount: 'tag',
  gift: 'gift',
} as const

export const PromotionPreview = () => {
  const { giftProductOptions } = usePromotionEditorFacade()
  const { control } = useFormContext<PromotionFormValues>()
  const values = useWatch({ control }) as PromotionFormValues
  const { headline, schedule, zones, period } = promotionSummaryParts(
    toPromotionSummarySource(
      values,
      giftProductOptions.find(({ value }) => value === values.giftProductId)?.name
    )
  )
  const facts = [
    { label: 'Quando', value: schedule ?? 'Todos os dias, o dia todo' },
    { label: 'Período', value: period ?? 'Sem data de fim' },
    ...(values.campaignType === 'free-delivery'
      ? [{ label: 'Zonas', value: zones ?? 'Todas as zonas' }]
      : []),
    { label: 'Código', value: values.code || 'Sem código' },
    { label: 'Limites', value: promotionLimitsLabel(values) },
  ]

  return (
    <Card variant="flat" padding="lg" className={styles.promotionPreview}>
      <Eyebrow>Como o cliente vê</Eyebrow>

      {values.showInMenu ? (
        <Box
          direction="row"
          className={styles.menuStrip}
          aria-label="Prévia da faixa no cardápio"
        >
          <Icon
            name={PREVIEW_ICONS[values.campaignType]}
            size="sm"
            className={styles.menuStripIcon}
          />
          <Text as="span" className={styles.menuStripText}>
            {[headline, period].filter(Boolean).join(' · ')}
          </Text>
        </Box>
      ) : (
        <Text className={styles.hiddenNote}>
          Não aparece no cardápio. Vale para quem digitar o código.
        </Text>
      )}

      <Separator />

      <Text className={styles.headline}>{headline}</Text>
      <Box className={styles.facts}>
        {facts.map(({ label, value }) => (
          <Box key={label} direction="row" className={styles.fact}>
            <Text as="span" className={styles.factLabel}>
              {label}
            </Text>
            <Text as="span" className={styles.factValue}>
              {value}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
