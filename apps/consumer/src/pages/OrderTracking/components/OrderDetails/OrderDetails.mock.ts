import type { OrderDetails } from '@custom_types/order/order-details'

export const orderDetailsMock: {
  details: OrderDetails
  channel: 'DELIVERY' | 'PICKUP'
  storeAddress: string
} = {
  channel: 'DELIVERY',
  storeAddress: 'Rua das Flores, 10 · Centro, Recife - PE',
  details: {
    items: [
      {
        id: 'item-1',
        name: 'Pizza Calabresa',
        quantity: 2,
        unitPrice: '40.00',
        notes: null,
        isGift: false,
        modifiers: [
          { name: 'Borda de catupiry', quantity: 1, unitPrice: '5.00' },
        ],
      },
    ],
    subtotal: '90.00',
    deliveryFee: '8.00',
    deliveryDiscount: '0',
    promotionDiscount: '10.00',
    loyaltyDiscount: '0',
    totalAmount: '88.00',
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    changeFor: '100.00',
    deliveryAddress: {
      street: 'Rua do Sol',
      number: '25',
      complement: 'Apto 3',
      neighborhood: 'Boa Vista',
      city: 'Recife',
      state: 'PE',
    },
    deliveryZoneName: 'Centro',
    tableNumber: null,
    pickupCode: null,
    notes: 'Sem cebola',
  },
}
