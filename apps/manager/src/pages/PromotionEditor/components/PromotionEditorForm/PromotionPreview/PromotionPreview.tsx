import { useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { toPromotionSummarySource } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { CAMPAIGN_TYPE_ICONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { promotionLimitsLabel } from '@pages/PromotionEditor/utils/promotionLimitsLabel/promotionLimitsLabel'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

import styles from './PromotionPreview.module.css'

const scopeLabel = ({
  productScope,
  scopeCategoryIds,
  scopeProductIds,
}: PromotionFormValues): string => {
  if (productScope === 'all') return 'Todo o cardápio'
  const parts = [
    scopeCategoryIds.length &&
      `${scopeCategoryIds.length} ${scopeCategoryIds.length === 1 ? 'categoria' : 'categorias'}`,
    scopeProductIds.length &&
      `${scopeProductIds.length} ${scopeProductIds.length === 1 ? 'produto' : 'produtos'}`,
  ].filter(Boolean)
  return parts.join(' e ') || 'Nenhum item escolhido'
}

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
  const benefitHeadline =
    values.campaignType === 'discount' &&
    values.productScope === 'chosen' &&
    (values.scopeProductIds.length > 0 || values.scopeCategoryIds.length > 0)
      ? headline.replace(/ em qualquer pedido$/, '') +
        ' em itens selecionados'
      : headline
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
      ? [
          {
            label: 'Cupom',
            value: values.code || 'Sem código, escolhido na lista',
          },
          { label: 'Vale para', value: scopeLabel(values) },
          {
            label: 'Clientes',
            value: values.firstOrderOnly ? 'Só no 1º pedido' : 'Todos',
          },
          {
            label: 'Pagamento',
            value: values.paymentMethods.length
              ? values.paymentMethods
                  .map((method) => PAYMENT_METHOD_LABEL[method])
                  .join(', ')
              : 'Qualquer forma',
          },
        ]
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
      <Box className={styles.summaryIntro}>
        <Heading level={2} size="md">
          Confira antes de criar
        </Heading>
        <Text className={styles.summaryHint}>
          Estas são as regras que serão aplicadas à campanha.
        </Text>
      </Box>

      <Box direction="row" className={styles.benefit}>
        <Box className={styles.benefitIcon}>
          <Icon name={CAMPAIGN_TYPE_ICONS[values.campaignType]} size="md" />
        </Box>
        <Box className={styles.benefitCopy}>
          <Text as="span" className={styles.benefitLabel}>
            Benefício
          </Text>
          <Text className={styles.headline}>{benefitHeadline}</Text>
        </Box>
      </Box>

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
