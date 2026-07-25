import { Link } from 'react-router'

import { Button } from '@nino/ds'

import { MenuBoard } from '@compositions/MenuBoard'
import { PageTitle } from '@components/PageTitle'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'

import styles from './Catalog.module.css'
import motion from '@styles/motion.module.css'

export const Catalog = () => {
  const tenant = useCurrentTenant()
  const role = useTenantRole()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headText}>
          <PageTitle accent="Cardápio">Cardápio</PageTitle>
          <p className={styles.subtitle}>
            Desligue o que acabou — o item some do app do cliente na hora.
          </p>
        </div>

        {role === 'TENANT_OWNER' && (
          <div className={styles.actions}>
            <Button
              asChild
              variant="outline"
              className={`${motion.press} ${styles.manageCategories}`}
            >
              <Link to="categorias">Gerenciar categorias</Link>
            </Button>
            <Button asChild className={`${motion.press} ${styles.newItem}`}>
              <Link to="novo">Novo item</Link>
            </Button>
          </div>
        )}
      </header>

      <MenuBoard tenantId={tenant?.tenantId ?? null} />
    </div>
  )
}
