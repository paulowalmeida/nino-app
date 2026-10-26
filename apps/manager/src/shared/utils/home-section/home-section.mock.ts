import type { Membership } from '@shared/types/auth/membership'

export const reportsViewerMock: Pick<Membership, 'permissions'> = {
  permissions: ['reports.view', 'orders.operate'],
}

export const counterOperatorMock: Pick<Membership, 'permissions'> = {
  permissions: ['orders.operate'],
}
