import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const DiningTableService = {
  list: (tenantId: string): Promise<Page<DiningTable>> =>
    api.get<Page<DiningTable>>(`tenants/${tenantId}/dining-tables`),

  create: (tenantId: string, data: { name: string }): Promise<DiningTable> =>
    api.create<typeof data, DiningTable>(
      `tenants/${tenantId}/dining-tables`,
      data
    ),

  createBatch: (
    tenantId: string,
    data: { quantity: number; prefix?: string }
  ): Promise<DiningTable[]> =>
    api.create<typeof data, DiningTable[]>(
      `tenants/${tenantId}/dining-tables/batch`,
      data
    ),

  update: (
    tenantId: string,
    id: string,
    data: { name?: string; isActive?: boolean }
  ): Promise<DiningTable> =>
    api.patch<typeof data, DiningTable>(
      `tenants/${tenantId}/dining-tables/${id}`,
      data
    ),

  remove: (tenantId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/dining-tables/${id}`),
}
