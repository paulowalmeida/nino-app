import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { ProgressLine } from '@nino/ds/components/ProgressLine'
import { Text } from '@nino/ds/components/Text'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import {
  couponBlockerReason,
  type CouponBlocker,
} from '@utils/coupon-blocker/coupon-blocker'
import { promotionLabel } from '@utils/promotion-label/promotion-label'

import styles from './CouponCard.module.css'

type CouponCardProps = {
  promotion: PublicPromotion
  blocker?: CouponBlocker | null
  /** Motivo genérico, quando a regra do cupom não tem um motivo estruturado. */
  note?: string
  children?: ReactNode
}

// WHY: desconto sem código se identifica pelo nome que a loja deu a ele.
const couponTitle = ({ code, name }: PublicPromotion) =>
  code ? `Cupom ${code}` : name

export const CouponCard = ({
  promotion,
  blocker,
  note,
  children,
}: CouponCardProps) => {
  const reason = blocker ? couponBlockerReason(blocker) : note
  return (
    <Box
      direction="row"
      className={reason ? styles.couponCardBlocked : styles.couponCard}
    >
      <Icon name="tag" size="sm" className={styles.couponIcon} />
      <Box className={styles.couponText}>
        <Text as="span" className={styles.couponTitle}>
          {couponTitle(promotion)}
        </Text>
        <Text as="span" className={styles.couponLabel}>
          {promotionLabel(promotion)}
        </Text>
        {reason && (
          <Text as="span" className={styles.couponReason}>
            {reason}
          </Text>
        )}
        {blocker?.kind === 'minimum' && (
          <ProgressLine
            value={blocker.progress}
            size="sm"
            label="Quanto falta para usar o cupom"
          />
        )}
      </Box>
      {children}
    </Box>
  )
}
