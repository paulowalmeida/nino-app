import identityStyles from '@compositions/StoreIdentity/StoreIdentity.module.css'
import styles from '@pages/home/Storefront.module.css'

import { MenuRowsSkeleton } from '@skeletons/MenuRowsSkeleton/MenuRowsSkeleton'

/** Larguras variadas pros chips, imitando nomes de categoria de tamanhos
 * diferentes. */
const chipWidths = [
  styles.skChipM,
  styles.skChipL,
  styles.skChipS,
  styles.skChipM,
]

/**
 * Espelha a forma real da vitrine: faixa da loja, identidade, busca, régua de
 * categorias e a grade de itens. Reusa as mesmas classes de layout do conteúdo
 * real, então a página não salta ao trocar o placeholder pelo cardápio.
 */
export const StorefrontSkeleton = () => (
  <div className={styles.page} aria-busy="true" aria-label="Carregando a loja">
    <div className={styles.skBanner} />

    <div className={styles.shell}>
      <div className={identityStyles.identityRow}>
        <div className={styles.skLogo} />
        <div className={styles.skLines}>
          <div className={styles.skName} />
          <div className={styles.skMeta} />
        </div>
      </div>

      <div className={styles.skSearch} />

      <div className={styles.skTrack}>
        {chipWidths.map((width, index) => (
          <span key={index} className={`${styles.skChip} ${width}`} />
        ))}
      </div>

      <MenuRowsSkeleton />
    </div>
  </div>
)
