import type { CustomerAddress } from '@shared/types/customer/customer-address'

export const customerAddressesMock: CustomerAddress[] = [
  {
    id: 'address-secondary',
    zipCode: '01310930',
    street: 'Avenida Paulista',
    number: '1000',
    complement: null,
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    isPrimary: null,
  },
  {
    id: 'address-primary',
    zipCode: '04543011',
    street: 'Rua Olimpíadas',
    number: '55',
    complement: 'apto 22',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo',
    state: 'SP',
    isPrimary: true,
  },
]
