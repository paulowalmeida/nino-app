import { useState } from 'react'
import type { KeyboardEvent } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { promotionLabel } from '@utils/promotion-label/promotion-label'

import { DisclosureTrigger } from '../DisclosureTrigger/DisclosureTrigger'

import styles from './CheckoutCoupon.module.css'

// WHY: desconto sem código se identifica pelo nome que a loja deu a ele.
const couponTitle = ({ code, name }: PublicPromotion) =>
  code ? `Cupom ${code}` : name

export const CheckoutCoupon = ({ checkout }: { checkout?: CheckoutFacade }) => {
  const {
    coupon,
    isCouponEligible,
    couponSuggestions,
    applyCouponCode,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    couponError,
  } = useCheckoutFacade(checkout)
  const [code, setCode] = useState('')

  const submitCode = () => {
    if (code.trim()) applyCouponCode(code)
  }

  /* WHY: o campo vive dentro do formulário do pedido; Enter aqui aplica o
   * cupom em vez de confirmar o pedido. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    submitCode()
  }

  if (coupon) {
    return (
      <Box direction="row" className={styles.couponApplied} role="status">
        <Icon name="tag" size="sm" className={styles.couponIcon} />
        <Box className={styles.couponText}>
          <Text as="span" className={styles.couponCode}>
            {couponTitle(coupon)}
          </Text>
          <Text as="span" className={styles.couponLabel}>
            {promotionLabel(coupon)}
          </Text>
          {!isCouponEligible && (
            <Text as="span" className={styles.couponNote}>
              Ainda não vale para este pedido: confira o pedido mínimo e o
              endereço.
            </Text>
          )}
        </Box>
        <Button type="button" variant="ghost" size="sm" onClick={removeCoupon}>
          Remover
        </Button>
      </Box>
    )
  }

  return (
    <Box className={styles.checkoutCoupon}>
      {couponSuggestions.length > 0 && (
        <Heading level={3} size="sm" className={styles.couponHeading}>
          Cupons e descontos
        </Heading>
      )}
      {couponSuggestions.map((suggestion) => (
        <Box
          key={suggestion.id}
          direction="row"
          className={styles.couponSuggestion}
        >
          <Icon name="tag" size="sm" className={styles.couponIcon} />
          <Box className={styles.couponText}>
            <Text as="span" className={styles.couponCode}>
              {couponTitle(suggestion)}
            </Text>
            <Text as="span" className={styles.couponLabel}>
              {promotionLabel(suggestion)}
            </Text>
          </Box>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => applyCoupon(suggestion)}
          >
            Aplicar
          </Button>
        </Box>
      ))}

      <Collapsible
        className={styles.couponDisclosure}
        trigger={<DisclosureTrigger>Tenho um cupom</DisclosureTrigger>}
      >
        <Box direction="row" className={styles.couponForm}>
          <Input
            value={code}
            placeholder="Código do cupom"
            aria-label="Código do cupom"
            autoCapitalize="characters"
            error={!!couponError}
            onKeyDown={handleKeyDown}
            onChange={(event) =>
              setCode(event.target.value.toUpperCase().replace(/\s/g, ''))
            }
          />
          <Button
            type="button"
            variant="secondary"
            loading={isApplyingCoupon}
            onClick={submitCode}
          >
            Aplicar
          </Button>
        </Box>
        {couponError && (
          <Text role="alert" className={styles.couponError}>
            {couponError}
          </Text>
        )}
      </Collapsible>
    </Box>
  )
}
