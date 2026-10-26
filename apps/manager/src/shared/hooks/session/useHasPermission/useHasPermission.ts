import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

/** Whether the cargo of the signed-in member in the current unit grants it. */
export const useHasPermission = (permission: UnitPermission): boolean =>
  useCurrentUnit()?.permissions.includes(permission) ?? false
