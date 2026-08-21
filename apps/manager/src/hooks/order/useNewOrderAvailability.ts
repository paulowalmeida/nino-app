import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@services/order.service'
import { brl } from '@utils/money'
import { paymentMethodsFor } from '@utils/order-flow'

type NewOrderAvailabilityInput = {
  channel: OrderChannel
  chosenMethod: PaymentMethod | null
  recipient: Recipient
}

type NewOrderAvailability = {
  methods: PaymentMethod[]
  method: PaymentMethod
  zoneOptions: { value: string; label: string }[]
  fee: number
  isPaused: boolean
  closedNow: boolean
  missingRecipient: boolean
}

export const useNewOrderAvailability = (
  tenantId: string | null,
  { channel, chosenMethod, recipient }: NewOrderAvailabilityInput
): NewOrderAvailability => {
  const query = useQuery({
    queryKey: ['order-availability', tenantId],
    queryFn: () => OrderService.getAvailability(tenantId as string),
    enabled: !!tenantId,
  })
  const availability = query.data
  const methods = paymentMethodsFor(
    availability?.acceptedPaymentMethods ?? ['CASH'],
    channel,
  )
  const method =
    chosenMethod && methods.includes(chosenMethod) ? chosenMethod : methods[0]
  const isDelivery = channel === 'DELIVERY'

  return {
    methods,
    method,
    zoneOptions: (availability?.deliveryZones ?? [])
      .map(({ id, name, fee }) => ({
        value: id,
        label: `${name} · ${brl(fee)}`,
      })),
    fee: isDelivery
      ? Number(
          availability?.deliveryZones.find(({ id }) => id === recipient.zoneId)
            ?.fee ?? 0,
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
