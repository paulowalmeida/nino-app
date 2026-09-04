import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'
import type { OrderChannel } from '@shared/types/order/order-channel'

/**
 * WHY: trocar o destino invalida o que foi preenchido para o anterior — mesa
 * só existe no balcão, endereço só na entrega — e deixar o resto para trás
 * mandaria dado de um destino no pedido de outro.
 */
export const setChannel = (set: SetCounterState, channel: OrderChannel) =>
  set({
    channel,
    tableNumber: '',
    recipient: {
      name: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      zoneId: '',
    },
  })
