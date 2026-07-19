import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { useSessionStore } from '@states/useSessionStore'

import type { StoreSwitcherProps } from './StoreSwitcher.types'

import styles from './StoreSwitcher.module.css'

/** Keeps the section when switching: /:tenantId/pedidos stays on pedidos. */
const sectionOf = (pathname: string): string =>
  pathname.split('/').slice(2).join('/') || 'visao-geral'

export const StoreSwitcher = ({ currentTenantId }: StoreSwitcherProps) => {
  const memberships = useSessionStore(({ memberships }) => memberships)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const current = memberships.find(
    ({ tenantId }) => tenantId === currentTenantId
  )

  if (memberships.length <= 1) {
    return (
      <p className={styles.single}>{current?.tenantName ?? 'Sua loja'}</p>
    )
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
        <span className={styles.name}>{current?.tenantName}</span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open && (
        <ul className={styles.list} role="listbox">
          {memberships.map(({ tenantId, tenantName }) => (
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
    </div>
  )
}
