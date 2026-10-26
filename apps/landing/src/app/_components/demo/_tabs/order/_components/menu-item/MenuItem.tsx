import styles from "./MenuItem.module.css"
import type { MenuItemProps } from "./MenuItem.types"

export function MenuItem({
  emoji,
  name,
  desc,
  price,
  priceOld,
  badge,
  qty,
}: MenuItemProps) {
  return (
    <div className={styles.menuItem}>
      <div className={styles.itemDetails}>
        <div className={styles.itemNameRow}>
          <span className={styles.itemName}>{name}</span>
          {badge && <span className={styles.newBadge}>{badge}</span>}
        </div>

        <div className={styles.itemDescription}>{desc}</div>

        <div className={styles.itemPriceRow}>
          <div>
            <span className={styles.itemPrice}>{price}</span>
            {priceOld && (
              <span className={styles.itemStrikedPrice}>{priceOld}</span>
            )}
          </div>

          {qty != null ? (
            <div className={styles.quantityControl}>
              <button className={styles.decreaseButton}>−</button>

              <span className={styles.quantityCount}>{qty}</span>

              <button className={styles.increaseButton}>+</button>
            </div>
          ) : (
            <button className={styles.addToCartButton}>+</button>
          )}
        </div>
      </div>

      <div className={styles.itemThumbnail}>{emoji}</div>
    </div>
  )
}
