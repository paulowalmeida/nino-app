import { useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { toPromotionSummarySource } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import { CAMPAIGN_TYPE_ICONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { promotionStripLabel } from '@pages/PromotionEditor/utils/promotionStripLabel/promotionStripLabel'
import { useObjectUrl } from '@shared/hooks/ui/useObjectUrl/useObjectUrl'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'
import { brl, moneyValue } from '@shared/utils/money/money'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

import styles from './MenuPreview.module.css'

export const MenuPreview = () => {
  const { giftProductOptions } = usePromotionEditorFacade()
  const { control } = useFormContext<PromotionFormValues>()
  const values = useWatch({ control }) as PromotionFormValues
  const uploadedImageUrl = useObjectUrl(values.imageFile ?? undefined)
  const summary = promotionSummaryParts(
    toPromotionSummarySource(
      values,
      giftProductOptions.find(({ value }) => value === values.giftProductId)
        ?.name
    )
  )
  const hasSelectedItems =
    values.campaignType === 'discount' &&
    values.productScope === 'chosen' &&
    (values.scopeProductIds.length > 0 || values.scopeCategoryIds.length > 0)
  const headline = hasSelectedItems
    ? summary.headline.replace(/ em qualquer pedido$/, '') +
      ' em itens selecionados'
    : summary.headline
  const { period } = summary
  const imageUrl =
    uploadedImageUrl ??
    (values.imageUrl && !values.removeImage
      ? resolveApiAssetUrl(values.imageUrl)
      : null)
  const isPackage = values.campaignType === 'package'
  const showsBanner =
    values.showInBanner && values.campaignType !== 'free-delivery'

  return (
    <Card variant="flat" padding="lg" className={styles.menuPreview}>
      <Box className={styles.intro}>
        <Heading level={2} size="sm">
          Como o cliente vê
        </Heading>
        <Text className={styles.hint}>
          Com as cores do Nino; no cardápio entram as da loja.
        </Text>
      </Box>

      {isPackage ? (
        <Box className={styles.slot}>
          <Text as="span" className={styles.slotLabel}>
            Seção Promoções
          </Text>
          <Box direction="row" className={styles.packageCard}>
            <Box className={styles.packageImage}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  className={styles.image}
                  wrapperClassName={styles.imageWrap}
                />
              ) : (
                <Icon name="image" size="md" />
              )}
            </Box>
            <Box className={styles.packageCopy}>
              <Text as="span" className={styles.packageName}>
                {values.name.trim() || headline}
              </Text>
              <Text as="span" className={styles.packagePrice}>
                {moneyValue(values.packagePrice) > 0
                  ? brl(moneyValue(values.packagePrice))
                  : 'Preço a definir'}
              </Text>
            </Box>
          </Box>
        </Box>
      ) : values.showInMenu ? (
        <Box className={styles.slot}>
          <Text as="span" className={styles.slotLabel}>
            Topo do cardápio
          </Text>
          <Box
            direction="row"
            className={`${styles.strip} ${
              values.campaignType === 'free-delivery'
                ? styles.stripFreeDelivery
                : ''
            }`}
          >
            <Icon
              name={CAMPAIGN_TYPE_ICONS[values.campaignType]}
              size="sm"
              className={styles.stripIcon}
            />
            <Text className={styles.stripText}>
              {promotionStripLabel({ headline, period })}
            </Text>
          </Box>
        </Box>
      ) : (
        <Text className={styles.offMenu}>
          {values.code
            ? `Fora do cardápio: só vale para quem digitar ${values.code}.`
            : 'Fora do cardápio: o cliente não vê a campanha.'}
        </Text>
      )}

      {showsBanner && (
        <Box className={styles.slot}>
          <Text as="span" className={styles.slotLabel}>
            Carrossel do cardápio
          </Text>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Imagem da campanha no carrossel"
              className={styles.image}
              wrapperClassName={styles.bannerWrap}
            />
          ) : (
            <Box className={styles.bannerEmpty}>
              <Text className={styles.hint}>
                Envie uma imagem para a campanha entrar no carrossel.
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Card>
  )
}
