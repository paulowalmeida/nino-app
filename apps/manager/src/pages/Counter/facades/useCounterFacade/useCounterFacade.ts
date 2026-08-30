import { useCounterCart } from '@pages/Counter/hooks/useCounterCart/useCounterCart'
import { useCounterCommands } from '@pages/Counter/hooks/useCounterCommands/useCounterCommands'
import { useCounterPaymentMethods } from '@pages/Counter/hooks/useCounterPaymentMethods/useCounterPaymentMethods'
import { useCounterPaymentSelection } from '@pages/Counter/hooks/useCounterPaymentSelection/useCounterPaymentSelection'
import { useCounterReceipt } from '@pages/Counter/hooks/useCounterReceipt/useCounterReceipt'
import { useCounterResponsive } from '@pages/Counter/hooks/useCounterResponsive/useCounterResponsive'
import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCounterFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const menu = useMenu(tenantId)
  const payments = useCounterPaymentMethods(tenantId)
  const cart = useCounterCart()
  const selection = useCounterPaymentSelection(payments.methods, cart.total)
  const commands = useCounterCommands(tenantId, selection.method)
  const receipt = useCounterReceipt()
  const responsive = useCounterResponsive()
  const sheet = useCounterStore((state) => state.sheet)
  const customerName = useCounterStore((state) => state.customerName)
  const tableNumber = useCounterStore((state) => state.tableNumber)
  const changeFor = useCounterStore((state) => state.changeFor)
  const setSheet = useCounterStore((state) => state.setSheet)
  const setChosen = useCounterStore((state) => state.setChosenPaymentMethod)
  const setCustomerName = useCounterStore((state) => state.setCustomerName)
  const setTableNumber = useCounterStore((state) => state.setTableNumber)
  const setChangeFor = useCounterStore((state) => state.setChangeFor)

  return {
    ...menu,
    ...payments,
    ...cart,
    ...selection,
    ...commands,
    ...receipt,
    ...responsive,
    sheet,
    customerName,
    tableNumber,
    changeFor,
    setSheet,
    setChosen,
    setCustomerName,
    setTableNumber,
    setChangeFor,
  }
}
