import { useLocation, useNavigate } from 'react-router'

import { Menu, type MenuItem } from '@nino/ds'

import { NavIcon } from '@components/NavIcon'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'

import type { StoreSwitcherProps } from './StoreSwitcher.types'

import styles from './StoreSwitcher.module.css'
import motion from '@styles/motion.module.css'

/** Keeps the section when switching: /:tenantId/pedidos stays on pedidos. */
const sectionOf = (pathname: string): string =>
  pathname.split('/').slice(2).join('/') || 'visao-geral'

export const StoreSwitcher = ({ currentTenantId }: StoreSwitcherProps) => {
  const groups = useCompanyGroups()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const company = groups.find(({ units }) =>
    units.some(({ tenantId }) => tenantId === currentTenantId)
  )
  const units = company?.units ?? []
  const current = units.find(({ tenantId }) => tenantId === currentTenantId)
  const hasOtherCompanies = groups.length > 1

  if (units.length <= 1 && !hasOtherCompanies) {
    return <p className={styles.single}>{current?.tenantName ?? 'Sua loja'}</p>
  }

  const goTo = (tenantId: string) =>
    navigate(`/${tenantId}/${sectionOf(pathname)}`)

  const items: MenuItem[] = [
    ...(units.length > 1
      ? units.map(({ tenantId, tenantName }) => ({
          value: tenantId,
          label: tenantName,
          icon:
            tenantId === currentTenantId ? (
              <NavIcon name="check" className={styles.checkIcon} />
            ) : undefined,
          onSelect: () => goTo(tenantId),
        }))
      : []),
    ...(units.length > 1 && hasOtherCompanies
      ? [{ separator: true as const }]
      : []),
    ...(hasOtherCompanies
      ? [
          {
            value: 'switch-company',
            label: 'Trocar de restaurante',
            onSelect: () => void navigate('/lojas'),
          },
        ]
      : []),
  ]

  return (
    <div className={styles.wrap}>
      <Menu
        trigger={
          <button
            type="button"
            className={`${motion.press} ${styles.trigger}`}
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
        }
        items={items}
        contentClassName={styles.panel}
        itemClassName={styles.option}
      />
    </div>
  )
}
