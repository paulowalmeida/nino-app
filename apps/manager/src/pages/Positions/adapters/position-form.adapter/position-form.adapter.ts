import { PERMISSION_GROUP_LABEL } from '@pages/Positions/constants/positions.constants'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'
import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import type { UnitPositionDraft } from '@shared/types/team/unit-position-draft.type'

export type PositionFormValues = {
  name: string
  level: number
  permissions: UnitPermission[]
}

export type PermissionGroup = {
  group: PermissionDefinition['group']
  label: string
  permissions: PermissionDefinition[]
}

export const emptyPositionFormValues = (level: number): PositionFormValues => ({
  name: '',
  level,
  permissions: [],
})

export const positionToFormValues = ({
  name,
  level,
  permissions,
}: UnitPosition): PositionFormValues => ({ name, level, permissions })

export const formValuesToDraft = ({
  name,
  level,
  permissions,
}: PositionFormValues): UnitPositionDraft => ({
  name: name.trim(),
  level,
  permissions,
})

/** Mantém a ordem em que cada grupo aparece pela primeira vez no catálogo. */
export const groupPermissions = (
  catalog: PermissionDefinition[]
): PermissionGroup[] =>
  catalog.reduce<PermissionGroup[]>((groups, definition) => {
    const existing = groups.find(({ group }) => group === definition.group)
    if (existing) {
      existing.permissions.push(definition)
      return groups
    }
    return [
      ...groups,
      {
        group: definition.group,
        label: PERMISSION_GROUP_LABEL[definition.group],
        permissions: [definition],
      },
    ]
  }, [])

export const togglePermission = (
  selected: UnitPermission[],
  permission: UnitPermission,
  isChecked: boolean
): UnitPermission[] =>
  isChecked
    ? [...selected.filter((key) => key !== permission), permission]
    : selected.filter((key) => key !== permission)
