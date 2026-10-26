import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import type { UnitRole } from '@shared/types/auth/unit-role'

export const useUnitRole = (): UnitRole | null =>
  useCurrentUnit()?.role ?? null
