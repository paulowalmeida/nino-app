import { useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { toPromotionSummarySource } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { promotionLimitsLabel } from '@pages/PromotionEditor/utils/promotionLimitsLabel/promotionLimitsLabel'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

import styles from './PromotionPreview.module.css'

export const PromotionPreview = () => {
  const { giftProductOptions } = usePromotionEditorFacade()
  const { control } = useFormContext<PromotionFormValues>()
  const values = useWatch({ control }) as PromotionFormValues
  const { headline, schedule, zones, period } = promotionSummaryParts(
    toPromotionSummarySource(
      values,
      giftProductOptions.find(({ value }) => value === values.giftProductId)
        ?.name
    )
  )
  const facts = [
    {
      label: 'Visibilidade',
      value: values.showInMenu ? 'Visível no cardápio' : 'Oculta do cardápio',
    },
    { label: 'Quando', value: schedule ?? 'Todos os dias, o dia todo' },
    { label: 'Período', value: period ?? 'Sem data de fim' },
    ...(values.campaignType === 'free-delivery'
      ? [{ label: 'Zonas', value: zones ?? 'Todas as zonas' }]
      : []),
    ...(values.campaignType === 'discount'
      ? [{ label: 'Cupom', value: values.code || 'Não informado' }]
      : []),
    ...(values.campaignType !== 'free-delivery'
      ? [
          {
            label: 'Carrossel',
            value: values.showInBanner ? 'Incluída' : 'Não incluída',
          },
        ]
      : []),
    { label: 'Limites', value: promotionLimitsLabel(values) },
  ]

  return (
    <Card variant="flat" padding="lg" className={styles.promotionPreview}>
      <Heading level={2} size="sm">
        Resumo da campanha
      </Heading>
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
