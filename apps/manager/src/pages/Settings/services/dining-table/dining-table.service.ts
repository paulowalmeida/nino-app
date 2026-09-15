import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const DiningTableService = {
  list: (unitId: string): Promise<Page<DiningTable>> =>
    api.get<Page<DiningTable>>(`units/${unitId}/dining-tables`),

  create: (unitId: string, data: { name: string }): Promise<DiningTable> =>
    api.create<typeof data, DiningTable>(
      `units/${unitId}/dining-tables`,
      data
    ),

  createBatch: (
    unitId: string,
    data: { quantity: number; prefix?: string }
  ): Promise<DiningTable[]> =>
    api.create<typeof data, DiningTable[]>(
      `units/${unitId}/dining-tables/batch`,
      data
    ),

  update: (
    unitId: string,
    id: string,
    data: { name?: string; isActive?: boolean }
  ): Promise<DiningTable> =>
    api.patch<typeof data, DiningTable>(
      `units/${unitId}/dining-tables/${id}`,
      data
    ),

  remove: (unitId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/dining-tables/${id}`),
}
