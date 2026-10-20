import { api } from '@shared/services/http/http.service'
import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import type {
  UnitPositionDraft,
  UnitPositionPatch,
} from '@shared/types/team/unit-position-draft.type'

export const PositionsService = {
  list: (unitId: string): Promise<UnitPosition[]> =>
    api.get<UnitPosition[]>(`units/${unitId}/positions`),

  listPermissions: (unitId: string): Promise<PermissionDefinition[]> =>
    api.get<PermissionDefinition[]>(`units/${unitId}/positions/permissions`),

  create: (unitId: string, draft: UnitPositionDraft): Promise<UnitPosition> =>
    api.create<UnitPositionDraft, UnitPosition>(
      `units/${unitId}/positions`,
      draft
    ),

  update: (
    unitId: string,
    positionId: string,
    patch: UnitPositionPatch
  ): Promise<UnitPosition> =>
    api.patch<UnitPositionPatch, UnitPosition>(
      `units/${unitId}/positions/${positionId}`,
      patch
    ),

  duplicate: (unitId: string, positionId: string): Promise<UnitPosition> =>
    api.create<Record<string, never>, UnitPosition>(
      `units/${unitId}/positions/${positionId}/duplicate`,
      {}
    ),

  remove: (unitId: string, positionId: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/positions/${positionId}`),
}
