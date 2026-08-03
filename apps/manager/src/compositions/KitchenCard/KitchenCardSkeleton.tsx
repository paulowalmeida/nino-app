import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './KitchenCard.module.css'

/** Duas linhas de item, o que cabe numa comanda antes de rolar. */
const GHOST_ITEMS = ['first', 'second']

/**
 * A forma da comanda de cozinha enquanto ela não chega. Divide o módulo com
 * o KitchenCard de propósito, como a comanda de balcão faz com a sua: mudar
 * a estrutura de uma move a outra junto.
 */
export const KitchenCardSkeleton = () => (
  <article className={styles.card}>
    <div className={styles.ribbon} aria-hidden="true" />

    <header className={styles.head}>
      <Skeleton className={styles.ghostNumber} />
      <Skeleton className={styles.ghostClock} />
    </header>

    <div className={styles.who}>
      <Skeleton className={styles.ghostChannel} />
      <Skeleton className={styles.ghostName} />
    </div>

    <div className={styles.items}>
      {GHOST_ITEMS.map((item) => (
        <div key={item} className={styles.item}>
          <Skeleton className={styles.ghostQuantity} />
          <Skeleton className={styles.ghostItemName} />
        </div>
      ))}
    </div>

    <Skeleton className={styles.ghostAction} />
  </article>
)
