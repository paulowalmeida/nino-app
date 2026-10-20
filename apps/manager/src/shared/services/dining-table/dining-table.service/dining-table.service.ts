import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const DINING_TABLE_PAGE_SIZE = 100

export const DiningTableService = {
  list: (unitId: string): Promise<Page<DiningTable>> =>
    api.getAll<Page<DiningTable>>(`units/${unitId}/dining-tables`, {
      target: 'name',
      direction: 'asc',
      size: DINING_TABLE_PAGE_SIZE,
      page: 1,
    }),

  create: (unitId: string, data: { name: string }): Promise<DiningTable> =>
    api.create<typeof data, DiningTable>(`units/${unitId}/dining-tables`, data),

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
