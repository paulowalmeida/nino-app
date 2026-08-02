import styles from './Storefront.module.css'

type MenuRowsSkeletonProps = {
  count?: number
}

/**
 * Placeholder do cardápio. Espelha a seção real: cabeçalho com nome e contagem
 * sobre a divisória tracejada, e o `MenuItemCard` — linha simples com divisória
 * no celular, card emoldurado em grade de 2 colunas no desktop, com a foto e o
 * botão "+" ancorado no canto já no lugar.
 */
export const MenuRowsSkeleton = ({ count = 4 }: MenuRowsSkeletonProps) => (
  <div aria-busy="true" aria-label="Carregando o cardápio">
    <div className={styles.skSectionHead}>
      <div className={styles.skSectionTitle} />
      <div className={styles.skSectionCount} />
    </div>

    <div className={styles.skItems}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skRow}>
          <div className={styles.skText}>
            <div className={styles.skItemName} />
            <div className={styles.skItemDesc} />
            <div className={styles.skItemPrice} />
          </div>
          <div className={styles.skMedia}>
            <div className={styles.skPhoto} />
            <div className={styles.skAdd} />
          </div>
        </div>
      ))}
    </div>
  </div>
)
