import { api } from '@shared/services/http/http.service'
import type { AddTabItemRequest } from '@shared/types/tab/add-tab-item-request'
import type { CancelTabRequest } from '@shared/types/tab/cancel-tab-request'
import type { CreateTabRequest } from '@shared/types/tab/create-tab-request.type'
import type { PayTabRequest } from '@shared/types/tab/pay-tab-request.type'
import type { SetTabServiceFeeRequest } from '@shared/types/tab/set-tab-service-fee-request.type'
import type { Tab } from '@shared/types/tab/tab.type'
import type { TabPage } from '@shared/types/tab/tab-page.type'
import type { TabStatus } from '@shared/types/tab/tab-status'

export const TAB_PAGE_SIZE = 40

export const TabService = {
  listTabs: (unitId: string, statuses: TabStatus[]): Promise<TabPage> =>
    api.getAll<TabPage>(`units/${unitId}/tabs`, {
      target: 'createdAt',
      direction: 'desc',
      size: TAB_PAGE_SIZE,
      page: 1,
      status: statuses.join(','),
    }),

  getById: (unitId: string, tabId: string): Promise<Tab> =>
    api.get<Tab>(`units/${unitId}/tabs/${tabId}`),

  openTab: (unitId: string, data: CreateTabRequest): Promise<Tab> =>
    api.create<CreateTabRequest, Tab>(`units/${unitId}/tabs`, data),

  addItem: (
    unitId: string,
    tabId: string,
    data: AddTabItemRequest
  ): Promise<Tab> =>
    api.create<AddTabItemRequest, Tab>(
      `units/${unitId}/tabs/${tabId}/items`,
      data
    ),

  cancelItem: (unitId: string, tabId: string, itemId: string): Promise<Tab> =>
    api.patch<Record<string, never>, Tab>(
      `units/${unitId}/tabs/${tabId}/items/${itemId}/cancel`,
      {}
    ),

  closeTab: (unitId: string, tabId: string): Promise<Tab> =>
    api.create<Record<string, never>, Tab>(
      `units/${unitId}/tabs/${tabId}/close`,
      {}
    ),

  reopenTab: (unitId: string, tabId: string): Promise<Tab> =>
    api.create<Record<string, never>, Tab>(
      `units/${unitId}/tabs/${tabId}/reopen`,
      {}
    ),

  setServiceFee: (
    unitId: string,
    tabId: string,
    data: SetTabServiceFeeRequest
  ): Promise<Tab> =>
    api.patch<SetTabServiceFeeRequest, Tab>(
      `units/${unitId}/tabs/${tabId}/service-fee`,
      data
    ),

  payTab: (unitId: string, tabId: string, data: PayTabRequest): Promise<Tab> =>
    api.create<PayTabRequest, Tab>(
      `units/${unitId}/tabs/${tabId}/payments`,
      data
    ),

  cancelTab: (
    unitId: string,
    tabId: string,
    data: CancelTabRequest
  ): Promise<Tab> =>
    api.create<CancelTabRequest, Tab>(
      `units/${unitId}/tabs/${tabId}/cancel`,
      data
    ),
}
