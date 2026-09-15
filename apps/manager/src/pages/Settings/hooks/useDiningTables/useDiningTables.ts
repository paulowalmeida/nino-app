import { useQuery } from '@tanstack/react-query'

import { DiningTableService } from '@pages/Settings/services/dining-table/dining-table.service'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
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
