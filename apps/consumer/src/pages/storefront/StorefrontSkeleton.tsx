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
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.skRow}>
          <div className={styles.skText}>
            <div className={styles.skItemName} />
            <div className={styles.skItemDesc} />
          </div>
          <div className={styles.skPhoto} />
        </div>
      ))}
    </div>
  </div>
)
