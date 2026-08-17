import type { StaffDetail } from '@custom_types/team/staff-detail'

export const staffWithLogin: StaffDetail = {
  tenantId: 'tenant-1',
  role: 'STAFF',
  isCurrent: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
    name: 'João Pereira',
    phone: '11988887777',
    isActive: true,
    lastLoginAt: '2026-07-01T00:00:00.000Z',
    profileCompletedAt: '2026-01-02T00:00:00.000Z',
    locale: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    credentials: [
      {
        id: 'credential-1',
        userId: 'user-1',
        email: 'joao@lojateste.com.br',
        provider: 'local',
        providerCode: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
  ordersHandled: 12,
  revenueHandled: 1284.5,
  statusChanges: 130,
  cancellations: 4,
  firstActivityAt: '2026-02-03T12:00:00.000Z',
  lastActivityAt: '2026-07-01T00:00:00.000Z',
  activity: [],
}

export const invitedStaff: StaffDetail = {
  ...staffWithLogin,
  role: 'MANAGER',
  firstActivityAt: null,
  user: {
    ...staffWithLogin.user,
    isActive: false,
    profileCompletedAt: null,
    credentials: [],
  },
}

export const ownerStaff: StaffDetail = {
  ...staffWithLogin,
  role: 'TENANT_OWNER',
}
