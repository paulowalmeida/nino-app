import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { StaffDetail } from '@shared/types/team/staff-detail'

export const useCollaboratorDetailQuery = (
  unitId: string | null,
  userId: string
) =>
  useQuery<StaffDetail>({
    queryKey: [...queryKeys.team.list(unitId ?? ''), 'detail', userId],
    queryFn: () => StaffService.getById(unitId as string, userId),
    enabled: !!unitId && !!userId,
  })
