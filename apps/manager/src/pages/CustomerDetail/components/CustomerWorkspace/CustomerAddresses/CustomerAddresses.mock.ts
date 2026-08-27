import type { CustomerAddressRowModel } from '@pages/CustomerDetail/types/CustomerAddressRowModel.type'

export const customerAddressRowsMock: CustomerAddressRowModel[] = [
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
