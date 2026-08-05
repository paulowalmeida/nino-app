import navStyles from '@pages/account/AccountNav/AccountNav.module.css'
import styles from '@pages/account/Account.module.css'

const NAV_ITEMS = Array.from({ length: 4 })

/**
 * Espelha a forma real: cabeçalho com a volta e a saudação, índice de
 * seções à esquerda no desktop, painel da seção aberta à direita. No
 * celular, header e índice ficam ocultos como no real — só o painel
 * aparece.
 */
export const AccountSkeleton = () => (
  <div className={styles.page} aria-busy="true" aria-label="Carregando a conta">
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.skBack} />
        <div className={styles.identity}>
          <div className={styles.skTitle} />
          <div className={styles.skSince} />
        </div>
      </header>

      <div className={styles.body}>
        <nav className={navStyles.nav}>
          <div className={navStyles.list}>
            {NAV_ITEMS.map((_, index) => (
              <div key={index} className={styles.skNavItem} />
            ))}
          </div>
        </nav>

        <div className={styles.panel}>
          <div className={styles.skPanelTitle} />
          <div className={styles.skPanelLine} />
          <div className={styles.skPanelCard} />
        </div>
      </div>
    </div>
  </div>
)
