import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { StaffPage } from '@shared/types/team/staff-page'

export const useStaff = (unitId: string | null) =>
  useQuery<StaffPage>({
    queryKey: queryKeys.team.list(unitId ?? ''),
    queryFn: () => StaffService.listStaff(unitId as string),
    enabled: !!unitId,
  })
