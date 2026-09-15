import { useQuery } from '@tanstack/react-query'

import type { NewOrderAvailability } from '@pages/NewOrder/types/NewOrderAvailability.type'
import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'
import { OrderService } from '@shared/services/order/order.service'
import { brl } from '@shared/utils/money/money'

export const useNewOrderAvailability = (
  unitId: string | null,
  { channel, chosenMethod, recipient }: NewOrderDraft
): NewOrderAvailability => {
  const query = useQuery({
    queryKey: ['order-availability', unitId],
    queryFn: () => OrderService.getAvailability(unitId as string),
    enabled: !!unitId,
  })
  const availability = query.data
  const methods = (availability?.acceptedPaymentMethods ?? ['CASH']).filter(
    (paymentMethod) => channel !== 'COUNTER' || paymentMethod !== 'CARD_ONLINE'
  )
  const method =
    chosenMethod && methods.includes(chosenMethod) ? chosenMethod : methods[0]
  const isDelivery = channel === 'DELIVERY'

  return {
    methods,
    method,
    zoneOptions: (availability?.deliveryZones ?? []).map(
      ({ id, name, fee }) => ({
        value: id,
        label: `${name} · ${brl(fee)}`,
      })
    ),
    fee: isDelivery
      ? Number(
          availability?.deliveryZones.find(({ id }) => id === recipient.zoneId)
            ?.fee ?? 0
        )
      : 0,
    isPaused: !!availability?.isPaused,
    closedNow: !!availability?.isPaused || availability?.isOpen === false,
    missingRecipient:
      isDelivery &&
      (!recipient.name ||
        !recipient.phone ||
        !recipient.street ||
        !recipient.zoneId),
  }
}
