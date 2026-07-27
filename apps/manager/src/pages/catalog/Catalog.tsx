import { Link } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { MenuBoard } from '@compositions/MenuBoard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'

import styles from './Catalog.module.css'
import motion from '@styles/motion.module.css'

export const Catalog = () => {
  const tenant = useCurrentTenant()
  const role = useTenantRole()

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description="Desligue o que acabou — o item some do app do cliente na hora."
        actions={
          role === 'TENANT_OWNER' ? (
            <>
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
            </>
          ) : undefined
        }
      />

      <MenuBoard tenantId={tenant?.tenantId ?? null} />
    </div>
  )
}
