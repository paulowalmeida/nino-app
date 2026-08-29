import { useQuery } from '@tanstack/react-query'

import { DiningTableService } from '@pages/Settings/services/dining-table/dining-table.service'
import { queryKeys } from '@shared/lib/query-keys'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const useDiningTables = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.tenant.diningTables(tenantId ?? ''),
    queryFn: () => DiningTableService.list(tenantId as string),
    enabled: !!tenantId,
  })

  const tables: DiningTable[] = query.data?.data ?? []

  return { ...query, tables }
}
