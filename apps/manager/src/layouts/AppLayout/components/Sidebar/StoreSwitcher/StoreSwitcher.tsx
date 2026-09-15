import { useLocation, useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'

import motion from '@styles/motion.module.css'
import styles from './StoreSwitcher.module.css'

const sectionOf = (pathname: string): string =>
  pathname.split('/').slice(2).join('/') || 'visao-geral'

type StoreSwitcherProps = {
  currentUnitId: string | null
  collapsed?: boolean
}

export const StoreSwitcher = ({
  currentUnitId,
  collapsed = false,
}: StoreSwitcherProps) => {
  const groups = useCompanyGroups()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const company = groups.find(({ units }) =>
    units.some(({ unitId }) => unitId === currentUnitId)
  )
  const units = company?.units ?? []
  const current = units.find(({ unitId }) => unitId === currentUnitId)
  const hasOtherCompanies = groups.length > 1

  if (units.length <= 1 && !hasOtherCompanies) {
    return collapsed ? (
      <Box
        className={styles.singleCollapsed}
        aria-label={`Unidade: ${current?.unitName ?? 'Sua loja'}`}
      >
        <Icon name="store" className={styles.storeIcon} />
      </Box>
    ) : (
      <Text as="p" className={styles.single}>
        {current?.unitName ?? 'Sua loja'}
      </Text>
    )
  }

  const goTo = (unitId: string) =>
    navigate(`/${unitId}/${sectionOf(pathname)}`)

  const check = (active: boolean) => (
    <Icon
      name="check"
      className={mergeClasses(styles.checkIcon, !active && styles.checkOff)}
    />
  )

  const items: MenuItem[] = [
    ...(units.length > 1
      ? units.map(({ unitId, unitName }) => ({
          value: unitId,
          label: unitName,
          icon: check(unitId === currentUnitId),
          onSelect: () => goTo(unitId),
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
    <Box className={styles.wrap}>
      <Menu
        trigger={
          <Button
            variant="ghost"
            className={mergeClasses(motion.press, styles.trigger)}
          >
            <Icon name="store" className={styles.storeIcon} />
            {!collapsed && (
              <>
                <Text as="span" className={styles.triggerText}>
                  <Text as="span" className={styles.name}>
                    {current?.unitName}
                  </Text>
                  {hasOtherCompanies && (
                    <Text as="span" className={styles.company}>
                      {company?.companyName}
                    </Text>
                  )}
                </Text>
                <span className={styles.caret} aria-hidden="true" />
              </>
            )}
          </Button>
        }
        items={items}
        contentClassName={styles.panel}
        itemClassName={styles.option}
      />
    </Box>
  )
}
