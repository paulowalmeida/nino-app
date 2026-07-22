import { displayName, initials, isOpen, shortAddress } from '@utils/store-info'

import type { StoreHeaderProps } from './StoreHeader.types'

import styles from './StoreHeader.module.css'

/**
 * O rosto da loja: logo sobre o brilho de marca, nome em corpo grande e o
 * selo de aberto/fechado — a primeira pergunta de quem chega com fome é "dá
 * para pedir agora?".
 */
export const StoreHeader = ({ store, hours }: StoreHeaderProps) => {
  const open = isOpen(store, hours)

  return (
    <header className={styles.header}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.brand}>
        <div className={styles.logo}>
          {store.logoUrl ? (
            <img src={store.logoUrl} alt="" className={styles.logoImg} />
          ) : (
            <span className={styles.logoFallback}>{initials(store)}</span>
          )}
        </div>

        <div className={styles.identity}>
          <h1 className={styles.name}>{displayName(store)}</h1>
          <p className={styles.address}>{shortAddress(store)}</p>
        </div>
      </div>

      <span
        className={`${styles.badge} ${open ? styles.badgeOpen : styles.badgeShut}`}
      >
        <span className={styles.dot} aria-hidden="true" />
        {open ? 'Aberto agora' : 'Fechado no momento'}
      </span>
    </header>
  )
}
