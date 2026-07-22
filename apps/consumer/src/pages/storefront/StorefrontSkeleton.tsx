import { MenuRowsSkeleton } from './MenuRowsSkeleton'
import styles from './Storefront.module.css'

/** Espera com a forma da vitrine: cabeçalho, trilha e algumas linhas. */
export const StorefrontSkeleton = () => (
  <div className={styles.page} aria-busy="true" aria-label="Carregando a loja">
    <div className={styles.skHeader}>
      <div className={styles.skLogo} />
      <div className={styles.skLines}>
        <div className={styles.skName} />
        <div className={styles.skAddress} />
      </div>
    </div>
    <div className={styles.skTrack}>
      <span className={styles.skChip} />
      <span className={styles.skChip} />
      <span className={styles.skChip} />
    </div>
    <div className={styles.menu}>
      <MenuRowsSkeleton />
    </div>
  </div>
)
