import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { StaffPage } from '@shared/types/team/staff-page'

export const useStaff = (tenantId: string | null) =>
  useQuery<StaffPage>({
    queryKey: queryKeys.team.list(tenantId ?? ''),
    queryFn: () => StaffService.listStaff(tenantId as string),
    enabled: !!tenantId,
  })
