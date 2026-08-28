export const tenantIdMock = 'tenant-1'
export const zoneIdMock = 'zone-1'

export const deliveryZonePageMock = {
  data: [
    {
      id: zoneIdMock,
      name: 'Centro',
      minRadiusKm: 0,
      maxRadiusKm: 5,
      fee: 5,
      isActive: true,
    },
  ],
  pagination: { total: 1 },
}

export const deliveryZoneMock = {
  id: zoneIdMock,
  name: 'Centro',
  minRadiusKm: 0,
  maxRadiusKm: 5,
  fee: 5,
  isActive: true,
}

export const createDeliveryZoneRequestMock = {
  name: 'Centro',
  minRadiusKm: 0,
  maxRadiusKm: 5,
  fee: 5,
}

export const updateDeliveryZoneRequestMock = { fee: 7 }

export const removeDeliveryZoneMessageMock = { message: 'Zona removida.' }
