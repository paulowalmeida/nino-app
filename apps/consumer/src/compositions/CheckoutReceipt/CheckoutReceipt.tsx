import { useState } from 'react'

import { Collapsible } from '@nino/ds/components/Collapsible'
import type { CartLine } from '@custom_types/cart/cart-line'
import { brl } from '@utils/money'

import styles from './CheckoutReceipt.module.css'

type CheckoutReceiptProps = {
  cartLines: CartLine[]
  subtotal: number
  isDelivery: boolean
  hasZone: boolean
  deliveryFee: number
}

/** A comanda dobrável: item a item, com o total no rodapé. */
export const CheckoutReceipt = ({
  cartLines,
  subtotal,
  isDelivery,
  hasZone,
  deliveryFee,
}: CheckoutReceiptProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={styles.receipt}
      trigger={
        <>
          <span className={styles.head}>
            <span className={styles.label}>Seu pedido</span>
            <span className={styles.count}>
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
              {brl(subtotal)}
            </span>
          </span>
          <span className={styles.toggle}>
            {isOpen ? 'Ocultar' : 'Ver itens'}
          </span>
        </>
      }
    >
      <div className={styles.items}>
        {cartLines.map(({ item, quantity }) => (
          <p key={item.id} className={styles.item}>
            <span className={styles.name}>
              <span className={styles.qty}>{quantity}×</span>
              {item.name}
            </span>
            <span>{brl(Number(item.price) * quantity)}</span>
          </p>
        ))}

        <div className={styles.rule} />

        <div className={styles.tally}>
          <p className={styles.tallyRow}>
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
          </p>
          {isDelivery && (
            <p className={styles.tallyRow}>
              <span>Entrega</span>
              <span>{hasZone ? brl(deliveryFee) : 'a definir'}</span>
            </p>
          )}
        </div>
      </div>
    </Collapsible>
  )
}
