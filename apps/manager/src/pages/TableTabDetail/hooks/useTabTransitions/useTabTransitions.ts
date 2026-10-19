import { useMutation } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { useSettleTab } from '@pages/TableTabDetail/hooks/useSettleTab/useSettleTab'
import { TabService } from '@shared/services/tab/tab.service/tab.service'
import type { CancelTabRequest } from '@shared/types/tab/cancel-tab-request'
import type { PayTabRequest } from '@shared/types/tab/pay-tab-request'
import type { Tab } from '@shared/types/tab/tab'

export const useTabTransitions = (unitId: string | null, tabId: string) => {
  const settleTab = useSettleTab(unitId)
  const settleWith = (message: string) => (tab: Tab) => {
    settleTab(tab)
    toast.success(message)
  }

  const close = useMutation<Tab, Error, void>({
    mutationFn: () => TabService.closeTab(unitId as string, tabId),
    onSuccess: settleWith('Comanda fechada'),
  })

  const reopen = useMutation<Tab, Error, void>({
    mutationFn: () => TabService.reopenTab(unitId as string, tabId),
    onSuccess: settleWith('Comanda reaberta'),
  })

  const pay = useMutation<Tab, Error, PayTabRequest>({
    mutationFn: (request) =>
      TabService.payTab(unitId as string, tabId, request),
    onSuccess: settleWith('Pagamento registrado'),
  })

  const cancel = useMutation<Tab, Error, CancelTabRequest>({
    mutationFn: (request) =>
      TabService.cancelTab(unitId as string, tabId, request),
    onSuccess: settleWith('Comanda cancelada'),
  })

  return {
    submitClose: close.mutate,
    submitReopen: reopen.mutate,
    submitPay: pay.mutate,
    submitCancel: cancel.mutate,
    isClosing: close.isPending,
    isReopening: reopen.isPending,
    isPaying: pay.isPending,
    isCancelling: cancel.isPending,
  }
}
