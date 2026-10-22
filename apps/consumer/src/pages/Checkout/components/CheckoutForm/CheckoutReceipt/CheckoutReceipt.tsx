import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'

import styles from './CheckoutReceipt.module.css'

export const CheckoutReceipt = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const {
    cartLines,
    subtotal,
    isDelivery,
    zone,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage,
    promotionDiscount,
    appliedDiscount,
    appliedGift,
  } = useCheckoutFacade(checkout)
  const [isOpen, setIsOpen] = useState(
    () => window.matchMedia?.('(min-width: 1024px)').matches ?? false
  )
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0)
  const hasZone = !!zone

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={styles.receipt}
      trigger={
        <>
          <Text as="span" className={styles.head}>
            <Text as="span" className={styles.checkoutReceiptLabel}>
              Resumo do pedido
            </Text>
            <Text as="span" className={styles.checkoutReceiptCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} · {brl(subtotal)}
            </Text>
          </Text>
          <Text as="span" className={styles.toggle}>
            {isOpen ? 'Ocultar' : 'Ver itens'}
          </Text>
        </>
      }
    >
      <Box className={styles.items}>
        <Box className={styles.itemsList}>
          {cartLines.map(({ id, item, quantity }) => (
            <Text as="p" key={id ?? item.id} className={styles.checkoutReceiptItem}>
              <Text as="span" className={styles.name}>
                <Text as="span" className={styles.qty}>
                  {quantity}×
                </Text>
                {item.name}
                {item.modifiers && item.modifiers.length > 0 && (
                  <Text as="span" className={styles.choices}>
                    {item.modifiers.map((modifier) => modifier.name).join(', ')}
                  </Text>
                )}
              </Text>
              <Text as="span">{brl(cartItemPrice(item) * quantity)}</Text>
            </Text>
          ))}
        </Box>

        <Box className={styles.rule} />

        <Box className={styles.tally}>
          <Text className={styles.tallyRow}>
            <Text as="span">Subtotal</Text>
            <Text as="span">{brl(subtotal)}</Text>
          </Text>
          {isDelivery && (
            <Text className={styles.tallyRow}>
              <Text as="span">Entrega</Text>
              {deliveryDiscount > 0 ? (
                <Text as="span" className={styles.freeDelivery}>
                  <Text as="span" className={styles.freeDeliveryWas}>
                    <Text as="span" className="sr-only">
                      de
                    </Text>
                    {brl(deliveryFee)}
                  </Text>
                  <Text as="span" className={styles.freeDeliveryNow}>
                    Grátis
                  </Text>
                </Text>
              ) : (
                <Text as="span">{hasZone ? brl(deliveryFee) : 'a definir'}</Text>
              )}
            </Text>
          )}
          {promotionDiscount > 0 && (
            <Text className={styles.tallyRow}>
              <Text as="span">
                {appliedDiscount?.code ? `Cupom ${appliedDiscount.code}` : 'Desconto'}
              </Text>
              <Text as="span" className={styles.discountAmount}>
                − {brl(promotionDiscount)}
              </Text>
            </Text>
          )}
          {appliedGift?.giftProduct && (
            <Text className={styles.tallyRow}>
              <Text as="span">{appliedGift.giftProduct.name} · Brinde</Text>
              <Text as="span" className={styles.freeDeliveryNow}>
                Grátis
              </Text>
            </Text>
          )}
          {freeDeliveryCoverage === 'outside-zone' && (
            <Text className={styles.freeDeliveryNote}>
              Frete grátis não vale para este endereço.
            </Text>
          )}
        </Box>
      </Box>
    </Collapsible>
  )
}
