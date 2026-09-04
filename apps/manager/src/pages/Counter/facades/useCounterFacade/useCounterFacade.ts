import { useCounterAvailability } from '@pages/Counter/hooks/useCounterAvailability/useCounterAvailability'
import { useCounterAddressSearch } from '@pages/Counter/hooks/useCounterAddressSearch/useCounterAddressSearch'
import { useCounterDeliveryQuote } from '@pages/Counter/hooks/useCounterDeliveryQuote/useCounterDeliveryQuote'
import { useCounterCart } from '@pages/Counter/hooks/useCounterCart/useCounterCart'
import { useCounterCommands } from '@pages/Counter/hooks/useCounterCommands/useCounterCommands'
import { useCounterPaymentMethods } from '@pages/Counter/hooks/useCounterPaymentMethods/useCounterPaymentMethods'
import { useCounterPaymentSelection } from '@pages/Counter/hooks/useCounterPaymentSelection/useCounterPaymentSelection'
import { useCounterReceipt } from '@pages/Counter/hooks/useCounterReceipt/useCounterReceipt'
import { useCounterResponsive } from '@pages/Counter/hooks/useCounterResponsive/useCounterResponsive'
import { useCounterShortcuts } from '@pages/Counter/hooks/useCounterShortcuts/useCounterShortcuts'
import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCounterFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const recipient = useCounterStore((state) => state.recipient)
  const menu = useMenu(tenantId)
  const payments = useCounterPaymentMethods(tenantId)
  const availability = useCounterAvailability(tenantId, recipient.zoneId)
  const addressSearch = useCounterAddressSearch(
    recipient.city || availability.storeAddress.city,
    recipient.state || availability.storeAddress.state,
    recipient.street
  )
  const deliveryQuote = useCounterDeliveryQuote(
    tenantId,
    recipient.zipCode ?? ''
  )
  const cart = useCounterCart()
  const deliveryFee =
    useCounterStore((state) => state.channel) === 'DELIVERY'
      ? (deliveryQuote.quote?.fee ?? 0)
      : 0
  const selection = useCounterPaymentSelection(
    payments.methods,
    cart.total + deliveryFee
  )
  const commands = useCounterCommands(tenantId, selection.method)
  const receipt = useCounterReceipt()
  const responsive = useCounterResponsive()
  const sheet = useCounterStore((state) => state.sheet)
  const step = useCounterStore((state) => state.step)
  const channel = useCounterStore((state) => state.channel)
  const customerName = useCounterStore((state) => state.customerName)
  const tableNumber = useCounterStore((state) => state.tableNumber)
  const changeFor = useCounterStore((state) => state.changeFor)
  const setSheet = useCounterStore((state) => state.setSheet)
  const setStep = useCounterStore((state) => state.setStep)
  const setChannel = useCounterStore((state) => state.setChannel)
  const setChosen = useCounterStore((state) => state.setChosenPaymentMethod)
  const setCustomerName = useCounterStore((state) => state.setCustomerName)
  const setTableNumber = useCounterStore((state) => state.setTableNumber)
  const setRecipient = useCounterStore((state) => state.setRecipient)
  const setChangeFor = useCounterStore((state) => state.setChangeFor)

  const canContinue =
    step === 'items'
      ? cart.count > 0
      : step === 'destination'
        ? channel === 'DELIVERY'
          ? Boolean(
              recipient.name.trim() &&
              recipient.phone.trim() &&
              recipient.zipCode?.replace(/\D/g, '').length === 8 &&
              recipient.street.trim() &&
              recipient.number.trim() &&
              deliveryQuote.quote
            )
          : channel !== null &&
            Boolean(customerName.trim() || tableNumber.trim())
        : step === 'payment'
          ? selection.method !== null && selection.isChangeValid
          : true

  useCounterShortcuts({
    isOpen: cart.count > 0,
    canAdvance: canContinue && !commands.isSending,
    onAdvance: () => {
      if (!sheet) {
        setSheet(true)
        return
      }
      if (step === 'items') setStep('destination')
      else if (step === 'destination') setStep('payment')
      else if (step === 'payment') setStep('review')
      else commands.finish()
    },
    onClose: () => setSheet(false),
  })

  return {
    ...menu,
    ...payments,
    ...cart,
    subtotal: cart.total,
    deliveryFee,
    total: cart.total + deliveryFee,
    ...selection,
    ...commands,
    ...receipt,
    ...responsive,
    sheet,
    step,
    channel,
    customerName,
    tableNumber,
    recipient,
    zones: availability.zones,
    storeAddress: availability.storeAddress,
    deliveryCities: availability.deliveryCities,
    deliveryQuote: deliveryQuote.quote,
    addressSuggestions: addressSearch.suggestions,
    isSearchingAddress: addressSearch.isSearching,
    isQuotingDelivery: deliveryQuote.isQuoting,
    changeFor,
    setSheet,
    setStep,
    setChannel,
    setChosen,
    setCustomerName,
    setTableNumber,
    setRecipient,
    setChangeFor,
  }
}
