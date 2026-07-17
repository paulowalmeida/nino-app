import { useNavigate } from 'react-router'

import { useSessionStore } from '@states/useSessionStore'

import styles from './StoreSelection.module.css'

export const StoreSelection = () => {
  const navigate = useNavigate()
  const memberships = useSessionStore((state) => state.memberships)

  const handleSelect = (tenantId: string) => () => {
    void navigate(`/${tenantId}/visao-geral`)
  }

  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Seus restaurantes</h1>
        <p className={styles.subtitle}>Escolha qual você quer gerenciar</p>

        <div className={styles.list}>
          {memberships.map(({ tenantId, tenantName, companyName, role }) => (
            <button
              key={tenantId}
              type="button"
              onClick={handleSelect(tenantId)}
              className={styles.store}
            >
              <span className={styles.storeName}>{companyName}</span>
              {tenantName !== companyName && (
                <span className={styles.storeUnit}>{tenantName}</span>
              )}
              <span className={styles.storeRole}>{role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
