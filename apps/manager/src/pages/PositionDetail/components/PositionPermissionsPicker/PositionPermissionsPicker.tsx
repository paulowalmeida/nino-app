import { useMemo, useState } from 'react'

import { Accordion } from '@nino/ds/components/Accordion'
import { Box } from '@nino/ds/components/Box'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
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
  disabled: boolean
  onChange: (permissions: UnitPermission[]) => void
}

export const PositionPermissionsPicker = ({
  value,
  disabled,
  onChange,
}: PositionPermissionsPickerProps) => {
  const { permissionCatalog } = usePositionDetailFacade()
  const groups = useMemo(
    () => groupPermissions(permissionCatalog),
    [permissionCatalog]
  )
  const [term, setTerm] = useState('')
  const [openGroups, setOpenGroups] = useState<string[]>(
    groups.slice(0, 1).map(({ group }) => group)
  )

  const isFiltering = term.trim().length > 0
  const shownGroups = groups
    .map((entry) => ({
      ...entry,
      visible: entry.permissions.filter((definition) =>
        matchesPermission(definition, term)
      ),
    }))
    .filter(({ visible }) => visible.length > 0)

  return (
    <Box direction="column" gap={3}>
      <Box className={styles.head}>
        <Heading level={2} size="sm" id="position-permissions">
          O que este cargo pode fazer
        </Heading>
        <Input
          type="search"
          value={term}
          placeholder="Filtrar permissões"
          aria-label="Filtrar permissões"
          className={styles.search}
          onChange={(event) => setTerm(event.target.value)}
        />
      </Box>

      {shownGroups.length === 0 ? (
        <EmptyState>{`Nenhuma permissão com "${term.trim()}".`}</EmptyState>
      ) : (
        <Accordion
          multiple
          value={isFiltering ? shownGroups.map(({ group }) => group) : openGroups}
          onValueChange={setOpenGroups}
          className={styles.groups}
          itemClassName={styles.group}
          items={shownGroups.map(({ group, label, permissions, visible }) => ({
            value: group,
            trigger: (
              <Box
                direction="row"
                align="baseline"
                className={styles.groupTrigger}
              >
                <Text as="span" className={styles.groupTitle}>
                  {label}
                </Text>
                <Text as="span" className={styles.groupCount}>
                  {`${permissions.filter(({ key }) => value.includes(key)).length} de ${permissions.length}`}
                </Text>
              </Box>
            ),
            content: (
              <Box className={styles.groupItems}>
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
              </Box>
            ),
          }))}
        />
      )}
    </Box>
  )
}
