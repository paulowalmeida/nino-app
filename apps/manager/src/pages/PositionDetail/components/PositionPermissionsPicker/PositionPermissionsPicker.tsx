import { useMemo, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Heading } from '@nino/ds/components/Heading'
import { Tabs } from '@nino/ds/components/Tabs'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'
import {
  groupPermissions,
  matchesPermission,
  togglePermission,
} from '@shared/utils/position-form/position-form'

import styles from './PositionPermissionsPicker.module.css'

type PositionPermissionsPickerProps = {
  value: UnitPermission[]
  /** Filter typed by the user; empty shows every permission. */
  term: string
  disabled: boolean
  onChange: (permissions: UnitPermission[]) => void
}

export const PositionPermissionsPicker = ({
  value,
  term,
  disabled,
  onChange,
}: PositionPermissionsPickerProps) => {
  const { permissionCatalog } = usePositionDetailFacade()
  const groups = useMemo(
    () => groupPermissions(permissionCatalog),
    [permissionCatalog]
  )
  const [activeTab, setActiveTab] = useState<string>(groups[0]?.group ?? '')

  const shownGroups = groups
    .map((entry) => ({
      ...entry,
      visible: entry.permissions.filter((definition) =>
        matchesPermission(definition, term)
      ),
    }))
    .filter(({ visible }) => visible.length > 0)
  const activeGroup = shownGroups.some(({ group }) => group === activeTab)
    ? activeTab
    : shownGroups[0]?.group

  return (
    <Box direction="column" gap={3}>
      <Heading level={2} size="sm" id="position-permissions">
        O que este cargo pode fazer
      </Heading>

      {shownGroups.length === 0 ? (
        <EmptyState>Nenhuma permissão para mostrar.</EmptyState>
      ) : (
        <Tabs
          value={activeGroup}
          onValueChange={setActiveTab}
          tabs={shownGroups.map(({ group, label, permissions, visible }) => ({
            value: group,
            label: `${label} · ${permissions.filter(({ key }) => value.includes(key)).length}/${permissions.length}`,
            content: (
              <Grid
                columns={{ mobile: 1, desktop: 2 }}
                gap={{ mobile: 3, desktop: 4 }}
                className={styles.items}
              >
                {visible.map((definition) => (
                  <FormField
                    key={definition.key}
                    orientation="horizontal"
                    label={definition.label}
                    helperText={definition.description}
                  >
                    <Checkbox
                      checked={value.includes(definition.key)}
                      disabled={disabled}
                      onCheckedChange={(checked) =>
                        onChange(
                          togglePermission(
                            value,
                            definition.key,
                            checked === true
                          )
                        )
                      }
                    />
                  </FormField>
                ))}
              </Grid>
            ),
          }))}
        />
      )}
    </Box>
  )
}
