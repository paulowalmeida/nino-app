import type { PaymentMethod } from '@shared/types/order/payment-method'

export const ticketFieldsMock = {
  methods: ['CASH', 'PIX'] as PaymentMethod[],
  method: 'CASH' as PaymentMethod,
  zoneOptions: [{ value: 'zone-1', label: 'Centro · R$ 5,00' }],
  recipient: {
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    zoneId: '',
  },
  notes: 'Sem cebola',
}
