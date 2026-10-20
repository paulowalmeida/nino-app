import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type UnitPositionDraft = {
  /** Left out when only the hierarchy or the permissions change. */
  name?: string
  belowPositionId: string
  permissions: UnitPermission[]
}

/** Change to an existing cargo: only the fields that moved. */
export type UnitPositionPatch = Partial<UnitPositionDraft>
