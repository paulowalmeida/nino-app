import type { ConsumerAddressRowModel } from '@pages/ConsumerDetail/types/ConsumerAddressRowModel.type'

export const consumerAddressRowsMock: ConsumerAddressRowModel[] = [
  {
    id: 'address-primary',
    streetLine: 'Rua Olimpíadas, 55 — apto 22',
    cityLine: 'Vila Olímpia · São Paulo/SP · CEP 04543-011',
    isPrimary: true,
  },
  {
    id: 'address-secondary',
    streetLine: 'Avenida Paulista, 1000',
    cityLine: 'Bela Vista · São Paulo/SP · CEP 01310-930',
    isPrimary: false,
  },
]
