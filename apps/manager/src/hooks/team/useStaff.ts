import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { StaffPage } from '@custom_types/team/staff-page'
import { StaffService } from '@services/staff.service'

export const useStaff = (tenantId: string | null) =>
  useQuery<StaffPage>({
    queryKey: queryKeys.team.list(tenantId ?? ''),
    queryFn: () => StaffService.listStaff(tenantId as string),
    enabled: !!tenantId,
  })
