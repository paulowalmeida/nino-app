import { MenuItem } from "@demo/_tabs/order/_components/menu-item/MenuItem"
import { categories, menuItems } from "./orderTab.constants"
import styles from "./OrderTab.module.css"

export function OrderTab() {
  const categoryItemClass = (active: boolean) =>
    `${styles.categoryPill}${active ? ` ${styles.categoryPillActive}` : ""}`

  return (
    <div>
      <div className={styles.storeHeader}>
        <div className={styles.storeLogo}>🍔</div>

        <div className={styles.storeDetails}>
          <div className={styles.storeName}>Burgão do Zé</div>

          <div className={styles.storeMetaInfo}>
            <span className={styles.storeRating}>⭐ 4.8</span>

            <span>·</span>

            <span>25–40 min</span>

            <span>·</span>
            <span>Frete R$3,99</span>
          </div>
        </div>

        <div className={styles.searchButton}>🔍 Buscar</div>
      </div>

      <div className={styles.searchBarWrapper}>
        <div className={styles.searchInputField}>
          <span className={styles.searchIcon}>🔍</span>

          <span className={styles.searchPlaceholder}>
            Buscar no cardápio...
          </span>
        </div>
      </div>

      <div className={styles.promo}>
        <div className={styles.promoDetails}>
          <span className={styles.promoIcon}>🎁</span>

          <div>
            <div className={styles.promoTitle}>Frete grátis acima de R$35</div>

            <div className={styles.promoSubtitle}>
              Faltam R$6,10 · Válido até 23h
            </div>
          </div>
        </div>

        <div className={styles.promoActivateButton}>ATIVAR</div>
      </div>

      <div className={styles.categorySection}>
        <div className={styles.categoryScrollList}>
          {categories.map(({ emoji, label, active }) => (
            <div key={label} className={categoryItemClass(!!active)}>
              {emoji} {label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.menuSectionTitle}>
        🔥 <span>Mais pedidos</span>
      </div>

      <div className={styles.menuItemList}>
        {menuItems.map((item) => (
          <MenuItem key={item.name} {...item} />
        ))}
      </div>

      <div className={styles.checkoutBar}>
        <div className={styles.checkoutBarLeft}>
          <span className={styles.cartItemCount}>1 item</span>

          <span className={styles.viewCartLabel}>Ver carrinho</span>
        </div>

        <span className={styles.checkoutTotal}>R$ 69,90 →</span>
      </div>
    </div>
  )
}
