import { MenuBoard } from '@compositions/MenuBoard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import styles from './Catalog.module.css'

export const Catalog = () => {
  const tenant = useCurrentTenant()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cardápio</h1>
        <p className={styles.subtitle}>
          Desligue o que acabou — o item some do app do cliente na hora.
        </p>
      </header>

      <MenuBoard tenantId={tenant?.tenantId ?? null} />
    </div>
  )
}
