import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'

import styles from './CheckoutReceipt.module.css'

/** A comanda dobrável: item a item, com o total no rodapé. */
export const CheckoutReceipt = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const { cartLines, subtotal, isDelivery, zone, deliveryFee } =
    useCheckoutFacade(checkout)
  const [isOpen, setIsOpen] = useState(false)
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
            <Text as="span" className={styles.label}>
              Seu pedido
            </Text>
            <Text as="span" className={styles.count}>
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
              {brl(subtotal)}
            </Text>
          </Text>
          <Text as="span" className={styles.toggle}>
            {isOpen ? 'Ocultar' : 'Ver itens'}
          </Text>
        </>
      }
    >
      <Box className={styles.items}>
        {cartLines.map(({ id, item, quantity }) => (
          <Text as="p" key={id} className={styles.item}>
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

        <Box className={styles.rule} />

        <Box className={styles.tally}>
          <Text className={styles.tallyRow}>
            <Text as="span">Subtotal</Text>
            <Text as="span">{brl(subtotal)}</Text>
          </Text>
          {isDelivery && (
            <Text className={styles.tallyRow}>
              <Text as="span">Entrega</Text>
              <Text as="span">{hasZone ? brl(deliveryFee) : 'a definir'}</Text>
            </Text>
          )}
        </Box>
      </Box>
    </Collapsible>
  )
}
