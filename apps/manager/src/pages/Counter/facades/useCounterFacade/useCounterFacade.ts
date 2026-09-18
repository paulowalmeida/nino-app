import { useCounterAddressSearch } from '@pages/Counter/hooks/useCounterAddressSearch/useCounterAddressSearch'
import { useCounterAvailability } from '@pages/Counter/hooks/useCounterAvailability/useCounterAvailability'
import { useCounterCart } from '@pages/Counter/hooks/useCounterCart/useCounterCart'
import { useCounterCommands } from '@pages/Counter/hooks/useCounterCommands/useCounterCommands'
import { useCounterDeliveryQuote } from '@pages/Counter/hooks/useCounterDeliveryQuote/useCounterDeliveryQuote'
import { useCounterPaymentMethods } from '@pages/Counter/hooks/useCounterPaymentMethods/useCounterPaymentMethods'
import { useCounterPaymentSelection } from '@pages/Counter/hooks/useCounterPaymentSelection/useCounterPaymentSelection'
import { useCounterReceipt } from '@pages/Counter/hooks/useCounterReceipt/useCounterReceipt'
import { useCounterResponsive } from '@pages/Counter/hooks/useCounterResponsive/useCounterResponsive'
import { useCounterShortcuts } from '@pages/Counter/hooks/useCounterShortcuts/useCounterShortcuts'
import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import { hasPickupRecipient } from '@pages/Counter/utils/hasPickupRecipient/hasPickupRecipient'
import { hasValidRecipientIdentity } from '@pages/Counter/utils/hasValidRecipientIdentity/hasValidRecipientIdentity'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useCounterFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const recipient = useCounterStore((state) => state.recipient)
  const addressLookupRequested = useCounterStore(
    (state) => state.addressLookupRequested
  )
  const channel = useCounterStore((state) => state.channel)
  const menu = useMenu(unitId)
  const payments = useCounterPaymentMethods(unitId)
  const availability = useCounterAvailability(unitId, recipient.zoneId)
  const addressSearch = useCounterAddressSearch(
    unitId,
    recipient.street,
    recipient.number,
    availability.storeAddress.state,
    addressLookupRequested,
  )
  const deliveryQuote = useCounterDeliveryQuote(
    unitId,
    channel === 'DELIVERY' ? recipient : {}
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
  const commands = useCounterCommands(unitId, selection.method)
  const receipt = useCounterReceipt(unitId)
  const responsive = useCounterResponsive()
  const sheet = useCounterStore((state) => state.sheet)
  const step = useCounterStore((state) => state.step)
  const consumerName = useCounterStore((state) => state.consumerName)
  const tableNumber = useCounterStore((state) => state.tableNumber)
  const changeFor = useCounterStore((state) => state.changeFor)
  const setSheet = useCounterStore((state) => state.setSheet)
  const setStep = useCounterStore((state) => state.setStep)
  const setChannel = useCounterStore((state) => state.setChannel)
  const setChosen = useCounterStore((state) => state.setChosenPaymentMethod)
  const setConsumerName = useCounterStore((state) => state.setConsumerName)
  const setTableNumber = useCounterStore((state) => state.setTableNumber)
  const setRecipient = useCounterStore((state) => state.setRecipient)
  const setAddressLookupRequested = useCounterStore(
    (state) => state.setAddressLookupRequested
  )
  const setChangeFor = useCounterStore((state) => state.setChangeFor)

  const canContinue =
    step === 'items'
      ? cart.count > 0
      : step === 'destination'
        ? channel === 'DELIVERY'
          ? Boolean(
              hasValidRecipientIdentity(recipient) &&
              (recipient.zipCode?.replace(/\D/g, '').length === 8 ||
                (recipient.latitude !== undefined &&
                  recipient.longitude !== undefined)) &&
              recipient.street.trim() &&
              recipient.number?.trim() &&
              deliveryQuote.quote
            )
          : channel === 'PICKUP'
            ? hasPickupRecipient(recipient)
            : channel === 'COUNTER' &&
              Boolean(consumerName.trim() || tableNumber.trim())
        : step === 'payment'
          ? selection.method !== null && selection.isChangeValid
          : true

  useCounterShortcuts({
    isOpen:
      cart.count > 0 && (step !== 'review' || selection.method !== 'CASH'),
    canAdvance: canContinue && !commands.isSending,
    onAdvance: () => {
      if (!sheet) {
        setSheet(true)
        return
      }
      if (step === 'items') setStep('destination')
      else if (step === 'destination')
        setStep(channel === 'DELIVERY' ? 'location' : 'payment')
      else if (step === 'location') setStep('payment')
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
    canContinue,
    step,
    channel,
    consumerName,
    tableNumber,
    recipient,
    addressLookupRequested,
    zones: availability.zones,
    deliveryQuote: deliveryQuote.quote,
    addressSuggestions: addressSearch.suggestions,
    isSearchingAddress: addressSearch.isSearching,
    resolveSelectedAddress: addressSearch.resolveSelectedAddress,
    isResolvingSelectedAddress: addressSearch.isResolvingSelectedAddress,
    isQuotingDelivery: deliveryQuote.isQuoting,
    changeFor,
    setSheet,
    setStep,
    setChannel,
    setChosen,
    setConsumerName,
    setTableNumber,
    setRecipient,
    setAddressLookupRequested,
    setChangeFor,
  }
}
