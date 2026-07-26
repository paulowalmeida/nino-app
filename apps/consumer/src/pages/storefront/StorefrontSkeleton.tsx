import { MenuRowsSkeleton } from './MenuRowsSkeleton'
import styles from './Storefront.module.css'

/** Larguras variadas pros chips, imitando nomes de categoria de tamanhos
 * diferentes — no desktop todos viram itens da lista vertical (largura cheia). */
const chipWidths = [
  styles.skChipM,
  styles.skChipL,
  styles.skChipS,
  styles.skChipM,
]

/**
 * Espelha a forma real da vitrine: cabeçalho, índice de categorias e a grade de
 * itens. No desktop reusa as mesmas classes de layout (`body`/`rail`/`menu`) do
 * conteúdo real, então a grade de duas colunas já nasce montada — sem salto ao
 * trocar o placeholder pelo cardápio.
 */
export const StorefrontSkeleton = () => (
  <div className={styles.page} aria-busy="true" aria-label="Carregando a loja">
    <div className={styles.topbar}>
      <div className={styles.skHeader}>
        <div className={styles.skLogo} />
        <div className={styles.skLines}>
          <div className={styles.skName} />
          <div className={styles.skMeta} />
        </div>
        <div className={styles.skSearch} />
      </div>
    </div>

    <div className={styles.body}>
      <aside className={styles.rail}>
        <div className={styles.skRailLabel} />
        <div className={styles.skTrack}>
          {chipWidths.map((width, i) => (
            <span key={i} className={`${styles.skChip} ${width}`} />
          ))}
        </div>
      </aside>

      <main className={styles.menu}>
        <MenuRowsSkeleton />
      </main>
    </div>
  </div>
)
