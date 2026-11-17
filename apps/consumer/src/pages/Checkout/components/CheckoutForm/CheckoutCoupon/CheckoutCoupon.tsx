import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CouponCard } from '@shared/components/CouponCard/CouponCard'
import { CheckoutCouponsDrawer } from './CheckoutCouponsDrawer/CheckoutCouponsDrawer'

import styles from './CheckoutCoupon.module.css'

const availableSummary = (count: number) => {
  if (count === 0) return 'Nenhum cupom vale para este pedido'
  return count === 1 ? '1 cupom disponível' : `${count} cupons disponíveis`
}

export const CheckoutCoupon = ({ checkout }: { checkout?: CheckoutFacade }) => {
  const {
    coupon,
    isCouponEligible,
    couponBlockerOf,
    isDelivery,
    couponSuggestions,
    removeCoupon,
  } = useCheckoutFacade(checkout)
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  /* WHY: o cupom digitado chega depois da validação na API; quando ele entra
   * no pedido, o painel já cumpriu o papel. */
  const couponId = coupon?.id
  useEffect(() => {
    if (couponId) setDrawerOpen(false)
  }, [couponId])

  const availableCount = couponSuggestions.filter(
    (promotion) => !couponBlockerOf(promotion)
  ).length
  const appliedBlocker =
    coupon && !isCouponEligible ? couponBlockerOf(coupon) : null
  const appliedNote =
    coupon && !isCouponEligible && !appliedBlocker
      ? isDelivery
        ? 'Ainda não vale para este pedido: confira o endereço.'
        : 'Ainda não vale para este pedido: confira a retirada.'
      : undefined

  return (
    <Box className={styles.checkoutCoupon}>
      <Heading level={3} size="sm" className={styles.couponHeading}>
        Cupons e descontos
      </Heading>

      {coupon ? (
        <Box role="status">
          <CouponCard
            promotion={coupon}
            blocker={appliedBlocker}
            note={appliedNote}
          >
            <Box direction="row" className={styles.appliedActions}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(true)}
              >
                Trocar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
              >
                Remover
              </Button>
            </Box>
          </CouponCard>
        </Box>
      ) : (
        <button
          type="button"
          className={styles.couponsEntry}
          onClick={() => setDrawerOpen(true)}
        >
          <Icon name="tag" size="sm" className={styles.entryIcon} />
          <Box className={styles.entryText}>
            <Text as="span" className={styles.entryTitle}>
              Ver cupons
            </Text>
            <Text as="span" className={styles.entrySummary}>
              {availableSummary(availableCount)}
            </Text>
          </Box>
          <Icon name="chevron-right" size="sm" className={styles.entryIcon} />
        </button>
      )}

      <CheckoutCouponsDrawer
        checkout={checkout}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </Box>
  )
}
