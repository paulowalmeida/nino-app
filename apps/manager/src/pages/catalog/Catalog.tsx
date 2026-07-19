import { MenuBoard } from '@compositions/MenuBoard'
import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import styles from './Catalog.module.css'

export const Catalog = () => {
  const tenant = useCurrentTenant()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Eyebrow>Sua loja</Eyebrow>
        <PageTitle accent="Cardápio">Cardápio</PageTitle>
        <p className={styles.subtitle}>
          Desligue o que acabou — o item some do app do cliente na hora.
        </p>
      </header>

      <MenuBoard tenantId={tenant?.tenantId ?? null} />
    </div>
  )
}
