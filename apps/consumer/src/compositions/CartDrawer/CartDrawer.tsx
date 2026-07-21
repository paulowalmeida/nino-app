import { Button, Drawer } from '@nino/ds'

import { primaryImage } from '@utils/menu-image'
import { brl } from '@utils/money'

import type { CartDrawerProps } from './CartDrawer.types'

import styles from './CartDrawer.module.css'

export const CartDrawer = ({
  open,
  onOpenChange,
  lines,
  total,
  onIncrement,
  onDecrement,
  onCheckout,
}: CartDrawerProps) => (
  <Drawer
    open={open}
    onOpenChange={onOpenChange}
    placement="bottom"
    title="Sua sacola"
    size="85dvh"
    contentClassName={styles.drawer}
  >
    <div className={styles.lines}>
      {lines.map(({ item, quantity }) => {
        const image = primaryImage(item)

        return (
          <div key={item.id} className={styles.line}>
            {image ? (
              <img src={image} alt="" className={styles.photo} />
            ) : (
              <div className={styles.photoFallback} aria-hidden="true" />
            )}

            <div className={styles.lineText}>
              <span className={styles.lineName}>{item.name}</span>
              <span className={styles.linePrice}>{brl(item.price)}</span>
            </div>

            <div className={styles.stepper}>
              <Button
                size="icon"
                variant="outline"
                className={styles.stepperBtn}
                aria-label={`Remover uma unidade de ${item.name}`}
                onClick={() => onDecrement(item.id)}
              >
                −
              </Button>
              <span className={styles.stepperCount}>{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className={styles.stepperBtn}
                aria-label={`Adicionar mais uma unidade de ${item.name}`}
                onClick={() => onIncrement(item.id)}
              >
                +
              </Button>
            </div>
          </div>
        )
      })}
    </div>

    <div className={styles.footer}>
      <span className={styles.total}>{brl(total)}</span>
      <Button onClick={onCheckout}>Finalizar pedido</Button>
    </div>
  </Drawer>
)
