import { useParams } from 'react-router'

import { useStoreServiceFee } from '@pages/TableTabDetail/hooks/useStoreServiceFee/useStoreServiceFee'
import { useTabDetail } from '@pages/TableTabDetail/hooks/useTabDetail/useTabDetail'
import { useTabItemCommands } from '@pages/TableTabDetail/hooks/useTabItemCommands/useTabItemCommands'
import { useTabPermissions } from '@pages/TableTabDetail/hooks/useTabPermissions/useTabPermissions'
import { useTabTransitions } from '@pages/TableTabDetail/hooks/useTabTransitions/useTabTransitions'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useTableTabDetailFacade = () => {
  const { tabId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const detail = useTabDetail(unitId, tabId ?? '')
  const itemCommands = useTabItemCommands(unitId, tabId ?? '')
  const transitions = useTabTransitions(unitId, tabId ?? '')
  const permissions = useTabPermissions()
  const menu = useMenu(unitId)
  const storeServiceFee = useStoreServiceFee(unitId)

  return {
    tab: detail.tab,
    isPending: detail.isPending,
    isError: detail.isError,
    menuSections: menu.sections,
    canCancelTab: permissions.canCancelTab,
    storeServiceFeePercent: storeServiceFee.storeServiceFeePercent,
    submitAddItem: itemCommands.submitAddItem,
    submitCancelItem: itemCommands.submitCancelItem,
    isAddingItem: itemCommands.isAddingItem,
    isCancellingItem: itemCommands.isCancellingItem,
    submitClose: transitions.submitClose,
    submitReopen: transitions.submitReopen,
    submitPay: transitions.submitPay,
    submitServiceFee: transitions.submitServiceFee,
    submitCancel: transitions.submitCancel,
    isClosing: transitions.isClosing,
    isReopening: transitions.isReopening,
    isPaying: transitions.isPaying,
    isSettingServiceFee: transitions.isSettingServiceFee,
    isCancelling: transitions.isCancelling,
  }
}
