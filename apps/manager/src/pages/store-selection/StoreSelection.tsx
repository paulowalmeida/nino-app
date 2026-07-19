import { useNavigate } from 'react-router'

import type { Membership } from '@custom_types/auth'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'

import styles from './StoreSelection.module.css'

const unitLabel = (total: number): string =>
  total === 1 ? '1 unidade' : `${total} unidades`

/** Resumes where the owner left off, falling back to the first unit. */
const entryUnit = (units: Membership[]): Membership =>
  units.find(({ isCurrent }) => isCurrent) ?? units[0]

export const StoreSelection = () => {
  const navigate = useNavigate()
  const companies = useCompanyGroups()

  const handleSelect = (units: Membership[]) => () => {
    void navigate(`/${entryUnit(units).tenantId}/visao-geral`)
  }

  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Seus restaurantes</h1>
        <p className={styles.subtitle}>Escolha qual você quer gerenciar</p>

        <div className={styles.list}>
          {companies.map(({ companyId, companyName, units }) => (
            <button
              key={companyId}
              type="button"
              onClick={handleSelect(units)}
              className={styles.store}
            >
              <span className={styles.storeName}>{companyName}</span>
              <span className={styles.storeUnit}>
                {units.length > 1
                  ? unitLabel(units.length)
                  : units[0].tenantName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
