import type { Ref } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Clipboard } from '@nino/ds/components/Clipboard'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import type { IconName } from '@nino/ds/components/Icon'
import { ListRow } from '@nino/ds/components/ListRow'
import { ProgressLine } from '@nino/ds/components/ProgressLine'
import { Text } from '@nino/ds/components/Text'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { CouponDetailAction } from '@custom_types/promotion/coupon-detail-action.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import {
  couponBlockerReason,
  type CouponBlocker,
} from '@utils/coupon-blocker/coupon-blocker'
import {
  couponConditions,
  couponSteps,
  couponValidity,
} from '@utils/coupon-detail/coupon-detail'
import { promotionBenefit } from '@utils/promotion-label/promotion-label'

import styles from './CouponDetail.module.css'

type CouponDetailProps = {
  promotion: PublicPromotion
  blocker: CouponBlocker | null
  zones: PublicDeliveryZone[]
  isApplied: boolean
  action: CouponDetailAction
  backRef: Ref<HTMLButtonElement>
  onBack: () => void
}

const iconByType: Record<PublicPromotion['type'], IconName> = {
  PERCENTAGE_DISCOUNT: 'percent',
  FIXED_DISCOUNT: 'tag',
  FREE_DELIVERY: 'motorbike',
  GIFT: 'gift',
  PACKAGE: 'package',
}

export const CouponDetail = ({
  promotion,
  blocker,
  zones,
  isApplied,
  action,
  backRef,
  onBack,
}: CouponDetailProps) => {
  const conditions = couponConditions(promotion, zones)
  const validity = couponValidity(promotion)
  const reason = blocker ? couponBlockerReason(blocker) : null
  const isDisabled = isApplied || (!!blocker && action.disabledWhenBlocked)
  const caption = isApplied
    ? 'Este cupom já está no seu pedido.'
    : action.disabledWhenBlocked && reason
      ? reason
      : action.note

  return (
    <Box className={styles.detail}>
      <Box className={styles.scroll}>
        <Button
          ref={backRef}
          type="button"
          variant="ghost"
          size="sm"
          className={styles.backButton}
          onClick={onBack}
        >
          <Icon name="arrow-left" size="sm" />
          Cupons
        </Button>

        <Box className={styles.hero}>
          <Box className={styles.heroIcon}>
            <Icon name={iconByType[promotion.type]} size="md" />
          </Box>
          <Heading level={3} size="xl" className={styles.benefit}>
            {promotionBenefit(promotion)}
          </Heading>
          <Text className={styles.name}>{promotion.name}</Text>
        </Box>

        <Box
          className={blocker ? styles.statusBlocked : styles.statusAvailable}
        >
          <Icon name={blocker ? 'info' : 'check-circle'} size="sm" />
          <Text as="span" className={styles.statusText}>
            {reason ?? 'Disponível para sua sacola'}
          </Text>
        </Box>
        {blocker?.kind === 'minimum' && (
          <ProgressLine
            value={blocker.progress}
            size="sm"
            label="Quanto falta para usar o cupom"
          />
        )}

        {promotion.code && (
          <Box className={styles.codeBlock}>
            <Text as="span" className={styles.sectionHint}>
              Código do cupom
            </Text>
            <Clipboard value={promotion.code} />
          </Box>
        )}

        <Box as="section" className={styles.section}>
          <Heading level={3} size="sm">
            Como usar
          </Heading>
          <Box as="ol" className={styles.steps}>
            {couponSteps(promotion).map((step) => (
              <li key={step} className={styles.step}>
                {step}
              </li>
            ))}
          </Box>
        </Box>

        {(conditions.length > 0 || validity) && (
          <Box as="section" className={styles.section}>
            <Heading level={3} size="sm">
              Condições
            </Heading>
            <Box as="ul" className={styles.conditions}>
              {conditions.map(({ key, icon, label, value }) => (
                <ListRow key={key} gap={3} padding={3} align="start">
                  <Icon name={icon} size="sm" className={styles.rowIcon} />
                  <Box className={styles.rowText}>
                    <Text as="span" className={styles.rowLabel}>
                      {label}
                    </Text>
                    <Text as="span" className={styles.rowValue}>
                      {value}
                    </Text>
                  </Box>
                </ListRow>
              ))}
              {validity && (
                <ListRow gap={3} padding={3} align="start">
                  <Icon name="calendar" size="sm" className={styles.rowIcon} />
                  <Box className={styles.rowText}>
                    <Text as="span" className={styles.rowLabel}>
                      Validade
                    </Text>
                    <Text as="span" className={styles.rowValue}>
                      Até {validity.date}
                    </Text>
                    {validity.remaining && (
                      <Text as="span" className={styles.remaining}>
                        {validity.remaining}
                      </Text>
                    )}
                  </Box>
                </ListRow>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box className={styles.footer}>
        {caption && (
          <Text
            id={`coupon-caption-${promotion.id}`}
            className={styles.caption}
          >
            {caption}
          </Text>
        )}
        <Button
          type="button"
          size="lg"
          className={action.mobileOnly ? styles.mobileOnly : undefined}
          disabled={isDisabled}
          aria-describedby={
            caption ? `coupon-caption-${promotion.id}` : undefined
          }
          onClick={() => action.onSelect(promotion)}
        >
          {isApplied ? 'Cupom aplicado' : action.label}
        </Button>
      </Box>
    </Box>
  )
}
