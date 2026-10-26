import { PERMISSION_GROUP_LABEL } from '@shared/constants/positions.constants'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'
import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import type { UnitPositionDraft } from '@shared/types/team/unit-position-draft.type'

export type PositionFormValues = {
  name: string
  belowPositionId: string
  permissions: UnitPermission[]
}

export type PermissionGroup = {
  group: PermissionDefinition['group']
  label: string
  permissions: PermissionDefinition[]
}

export const emptyPositionFormValues = (
  belowPositionId: string
): PositionFormValues => ({
  name: '',
  belowPositionId,
  permissions: [],
})

export const positionToFormValues = ({
  name,
  belowPositionId,
  permissions,
}: UnitPosition): PositionFormValues => ({
  name,
  belowPositionId: belowPositionId ?? '',
  permissions,
})

export const formValuesToDraft = ({
  name,
  belowPositionId,
  permissions,
}: PositionFormValues): UnitPositionDraft => ({
  name: name.trim(),
  belowPositionId,
  permissions,
})

/** Cargos que podem ficar logo acima: todos, menos o próprio. */
export const placementOptions = (
  positions: UnitPosition[],
  selfId: string | undefined
): { value: string; label: string }[] =>
  positions
    .filter(({ id }) => id !== selfId)
    .map(({ id, name }) => ({ value: id, label: name }))

/** Um cargo novo nasce no fim da hierarquia, abaixo do último. */
export const lowestPositionId = (positions: UnitPosition[]): string =>
  positions[positions.length - 1]?.id ?? ''

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

/** Casa o termo com o nome ou a descrição da permissão, sem acento nem caixa. */
export const matchesPermission = (
  { label, description }: PermissionDefinition,
  term: string
): boolean => {
  const plain = (text: string): string =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const needle = plain(term.trim())

  return plain(`${label} ${description}`).includes(needle)
}
