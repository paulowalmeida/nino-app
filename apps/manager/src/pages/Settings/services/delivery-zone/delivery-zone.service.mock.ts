export const tenantIdMock = 'tenant-1'
export const zoneIdMock = 'zone-1'

export const deliveryZonePageMock = {
  data: [{ id: zoneIdMock, name: 'Centro', fee: 5, isActive: true }],
  pagination: { total: 1 },
}

export const deliveryZoneMock = {
  id: zoneIdMock,
  name: 'Centro',
  fee: 5,
  isActive: true,
}

export const createDeliveryZoneRequestMock = { name: 'Centro', fee: 5 }

export const updateDeliveryZoneRequestMock = { fee: 7 }

export const removeDeliveryZoneMessageMock = { message: 'Zona removida.' }
