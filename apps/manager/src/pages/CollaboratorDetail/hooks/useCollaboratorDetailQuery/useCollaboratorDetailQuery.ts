import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { StaffDetail } from '@shared/types/team/staff-detail'

export const useCollaboratorDetailQuery = (
  tenantId: string | null,
  userId: string
) =>
  useQuery<StaffDetail>({
    queryKey: [...queryKeys.team.list(tenantId ?? ''), 'detail', userId],
    queryFn: () => StaffService.getById(tenantId as string, userId),
    enabled: !!tenantId && !!userId,
  })
