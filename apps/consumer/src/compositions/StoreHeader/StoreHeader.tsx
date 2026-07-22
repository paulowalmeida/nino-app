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
          <p className={styles.address}>
            <svg
              className={styles.pin}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.4" fill="currentColor" />
            </svg>
            {shortAddress(store)}
          </p>
        </div>
      </div>

      <span
        className={`${styles.badge} ${open ? styles.badgeOpen : styles.badgeShut}`}
      >
        <span className={styles.dot} aria-hidden="true" />
        {open ? 'Aberto agora' : 'Fechado no momento'}
      </span>

      <div className={styles.valance} aria-hidden="true" />
    </header>
  )
}
