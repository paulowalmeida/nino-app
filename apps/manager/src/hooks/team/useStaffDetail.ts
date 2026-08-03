import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { StaffDetail } from '@custom_types/team'
import { getStaffDetail } from '@services/team/team.service'

export const useStaffDetail = (tenantId: string | null, userId: string) =>
  useQuery<StaffDetail>({
    queryKey: [...queryKeys.team.list(tenantId ?? ''), 'detail', userId],
    queryFn: () => getStaffDetail(tenantId as string, userId),
    enabled: !!tenantId && !!userId,
  })
