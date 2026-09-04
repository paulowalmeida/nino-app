export const tenantIdMock = 'tenant-1'

export const createStoreRequestMock = {
  slug: 'padoca-do-bairro',
  typeId: 'bakery',
  zipCode: '01001000',
  street: 'Rua das Flores',
  number: '100',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [{ city: 'São Paulo', state: 'SP' }],
}

export const createdStoreMock = { id: tenantIdMock, name: 'Padoca do Bairro' }

export const storeTypeOptionsMock = [{ id: 'bakery', label: 'Padaria' }]

export const slugAvailabilityMock = { available: true }

export const tenantDetailMock = { id: tenantIdMock, name: 'Padoca do Bairro' }

export const updateTenantRequestMock = {
  customName: 'Padoca do Bairro Ltda',
  timezone: 'America/Sao_Paulo',
  zipCode: '01001000',
  street: 'Rua das Flores',
  number: '100',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [{ city: 'São Paulo', state: 'SP' }],
}

export const tenantPauseMock = { isPaused: false }

export const pauseRequestMock = { reason: 'Sem entregadores disponíveis' }

export const removeTenantMessageMock = { message: 'Loja removida.' }
