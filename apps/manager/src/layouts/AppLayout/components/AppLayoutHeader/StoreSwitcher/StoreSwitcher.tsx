import { useLocation, useNavigate } from 'react-router'

import { unitSwitchPath } from '@layouts/AppLayout/utils/unit-switch-path/unit-switch-path'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'

import motion from '@styles/motion.module.css'
import styles from './StoreSwitcher.module.css'

type StoreSwitcherProps = {
  currentUnitId: string | null
}

export const StoreSwitcher = ({ currentUnitId }: StoreSwitcherProps) => {
  const groups = useCompanyGroups()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const company = groups.find(({ units }) =>
    units.some(({ unitId }) => unitId === currentUnitId)
  )
  const units = company?.units ?? []
  const current = units.find(({ unitId }) => unitId === currentUnitId)
  const currentName = current?.unitName ?? 'Sua loja'
  const hasOtherCompanies = groups.length > 1

  if (units.length <= 1 && !hasOtherCompanies) {
    return (
      <Text as="span" className={styles.single}>
        {currentName}
      </Text>
    )
  }

  const check = (active: boolean) => (
    <Icon
      name="check"
      className={mergeClasses(styles.checkIcon, !active && styles.checkOff)}
    />
  )

  const items: MenuItem[] = [
    ...(units.length > 1
      ? units.map((unit) => ({
          value: unit.unitId,
          label: unit.unitName,
          icon: check(unit.unitId === currentUnitId),
          onSelect: () => void navigate(unitSwitchPath(pathname, unit)),
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
            icon: check(false),
            onSelect: () => void navigate('/lojas'),
          },
        ]
      : []),
  ]

  return (
    <Menu
      trigger={
        <Button
          variant="ghost"
          className={mergeClasses(motion.press, styles.storeSwitcherTrigger)}
        >
          <Text as="span" className={styles.triggerText}>
            <Text as="span" className={styles.name}>
              {currentName}
            </Text>
            {hasOtherCompanies && (
              <Text as="span" className={styles.company}>
                {company?.companyName}
              </Text>
            )}
          </Text>
          <Icon name="chevron-down" size="sm" className={styles.chevron} />
        </Button>
      }
      items={items}
      contentClassName={styles.storeSwitcherPanel}
    />
  )
}
