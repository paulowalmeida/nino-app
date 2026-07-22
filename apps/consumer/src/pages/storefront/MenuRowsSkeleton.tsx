import styles from './Storefront.module.css'

type MenuRowsSkeletonProps = {
  count?: number
}

/** Linhas de item na forma de placeholder — cardápio ainda carregando. */
export const MenuRowsSkeleton = ({ count = 4 }: MenuRowsSkeletonProps) => (
  <div aria-busy="true" aria-label="Carregando o cardápio">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.skRow}>
        <div className={styles.skText}>
          <div className={styles.skItemName} />
          <div className={styles.skItemDesc} />
        </div>
        <div className={styles.skPhoto} />
      </div>
    ))}
  </div>
)
