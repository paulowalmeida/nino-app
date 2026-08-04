import type { CourierPage } from '@custom_types/team'

export const courierPage: CourierPage = {
  data: [
    {
      tenantId: 'tenant-1',
      isActive: true,
      createdAt: '2026-08-01T00:00:00.000Z',
      courier: {
        id: 'courier-1',
        name: 'João Entregador',
        phone: '85999990000',
        isActive: true,
        lastLoginAt: null,
        profileCompletedAt: null,
        locale: null,
        timezone: null,
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-08-01T00:00:00.000Z',
        credentials: [],
      },
    },
  ],
  pagination: { total: 1 },
}

export const emptyCourierPage: CourierPage = {
  data: [],
  pagination: { total: 0 },
}
