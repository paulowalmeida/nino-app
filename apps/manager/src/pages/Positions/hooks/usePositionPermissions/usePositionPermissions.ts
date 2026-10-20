import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PositionsService } from '@shared/services/positions/positions.service/positions.service'
import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'

export const usePositionPermissions = (unitId: string | null) =>
  useQuery<PermissionDefinition[]>({
    queryKey: queryKeys.positions.permissions(unitId ?? ''),
    queryFn: () => PositionsService.listPermissions(unitId as string),
    enabled: !!unitId,
    staleTime: Infinity,
  })
