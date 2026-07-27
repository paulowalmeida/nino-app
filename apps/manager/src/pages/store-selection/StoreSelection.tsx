import { useNavigate } from 'react-router'

import { Card } from '@nino/ds/components/Card'
import type { Membership } from '@custom_types/auth'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { riseDelay } from '@utils/rise-delay'

import styles from './StoreSelection.module.css'
import motion from '@styles/motion.module.css'

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
      <div className={`${motion.settle} ${styles.panel}`}>
        <h1 className={styles.title}>Seus restaurantes</h1>
        <p className={styles.subtitle}>Escolha qual você quer gerenciar</p>

        <div className={styles.list}>
          {companies.map(({ companyId, companyName, units }, index) => (
            <Card
              key={companyId}
              asChild
              variant="flat"
              className={`${motion.settle} ${motion.lift} ${styles.store}`}
            >
              <button
                type="button"
                onClick={handleSelect(units)}
                style={riseDelay(index * 80 + 100)}
              >
                <span className={styles.storeName}>{companyName}</span>
                <span className={styles.storeUnit}>
                  {units.length > 1
                    ? unitLabel(units.length)
                    : units[0].tenantName}
                </span>
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
