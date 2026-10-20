import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { DiningTableService } from '@shared/services/dining-table/dining-table.service/dining-table.service'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const useDiningTables = (unitId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.unit.diningTables(unitId ?? ''),
    queryFn: () => DiningTableService.list(unitId as string),
    enabled: !!unitId,
  })

  const tables: DiningTable[] = query.data?.data ?? []

  return { ...query, tables }
}
