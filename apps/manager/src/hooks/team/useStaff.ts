import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { StaffPage } from '@custom_types/team'
import { listStaff } from '@services/team/team.service'

export const useStaff = (tenantId: string | null) =>
  useQuery<StaffPage>({
    queryKey: queryKeys.team.list(tenantId ?? ''),
    queryFn: () => listStaff(tenantId as string),
    enabled: !!tenantId,
  })
