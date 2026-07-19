import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'

import type { StoreSwitcherProps } from './StoreSwitcher.types'

import styles from './StoreSwitcher.module.css'

/** Keeps the section when switching: /:tenantId/pedidos stays on pedidos. */
const sectionOf = (pathname: string): string =>
  pathname.split('/').slice(2).join('/') || 'visao-geral'

export const StoreSwitcher = ({ currentTenantId }: StoreSwitcherProps) => {
  const groups = useCompanyGroups()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const company = groups.find(({ units }) =>
    units.some(({ tenantId }) => tenantId === currentTenantId)
  )
  const units = company?.units ?? []
  const current = units.find(({ tenantId }) => tenantId === currentTenantId)
  const hasOtherCompanies = groups.length > 1

  if (units.length <= 1 && !hasOtherCompanies) {
    return <p className={styles.single}>{current?.tenantName ?? 'Sua loja'}</p>
  }

  const goTo = (tenantId: string) => {
    setOpen(false)
    void navigate(`/${tenantId}/${sectionOf(pathname)}`)
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <NavIcon name="store" className={styles.storeIcon} />
        <span className={styles.trigerText}>
          <span className={styles.name}>{current?.tenantName}</span>
          {hasOtherCompanies && (
            <span className={styles.company}>{company?.companyName}</span>
          )}
        </span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.panel}>
          {units.length > 1 && (
            <ul className={styles.list} role="listbox">
              {units.map(({ tenantId, tenantName }) => (
                <li key={tenantId}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={tenantId === currentTenantId}
                    className={styles.option}
                    onClick={() => goTo(tenantId)}
                  >
                    <span className={styles.optionName}>{tenantName}</span>
                    {tenantId === currentTenantId && (
                      <NavIcon name="check" className={styles.checkIcon} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {hasOtherCompanies && (
            <button
              type="button"
              className={styles.switchCompany}
              onClick={() => {
                setOpen(false)
                void navigate('/lojas')
              }}
            >
              Trocar de restaurante
            </button>
          )}
        </div>
      )}
    </div>
  )
}
