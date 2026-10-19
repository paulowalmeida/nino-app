import { useMutation } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { useSettleTab } from '@pages/TableTabDetail/hooks/useSettleTab/useSettleTab'
import { TabService } from '@shared/services/tab/tab.service/tab.service'
import type { AddTabItemRequest } from '@shared/types/tab/add-tab-item-request'
import type { Tab } from '@shared/types/tab/tab'

export const useTabItemCommands = (unitId: string | null, tabId: string) => {
  const settleTab = useSettleTab(unitId)

  const addItem = useMutation<Tab, Error, AddTabItemRequest>({
    mutationFn: (request) =>
      TabService.addItem(unitId as string, tabId, request),
    onSuccess: (tab) => {
      settleTab(tab)
      toast.success('Item lançado')
    },
  })

  const cancelItem = useMutation<Tab, Error, string>({
    mutationFn: (itemId) =>
      TabService.cancelItem(unitId as string, tabId, itemId),
    onSuccess: (tab) => {
      settleTab(tab)
      toast.success('Item cancelado')
    },
  })

  return {
    submitAddItem: addItem.mutate,
    submitCancelItem: cancelItem.mutate,
    isAddingItem: addItem.isPending,
    isCancellingItem: cancelItem.isPending,
  }
}
