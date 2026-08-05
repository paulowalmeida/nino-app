import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { StaffService } from '@services/staff.service'

export const useStaffDetail = (tenantId: string | null, userId: string) =>
  useQuery<StaffDetail>({
    queryKey: [...queryKeys.team.list(tenantId ?? ''), 'detail', userId],
    queryFn: () => StaffService.getById(tenantId as string, userId),
    enabled: !!tenantId && !!userId,
  })
