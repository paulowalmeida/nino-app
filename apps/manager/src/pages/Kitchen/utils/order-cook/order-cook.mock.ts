import type { Order } from '@shared/types/order/order'
import type { StaffMember } from '@shared/types/team/staff-member'

export const cookOrderMock: Order = {
  id: 'order-1',
  orderNumber: 1,
  tenantId: 'tenant-1',
  customerId: null,
  status: 'PREPARING',
  channel: 'COUNTER',
  courierId: null,
  kitchenAssigneeId: 'cook-1',
  deliveryAddress: null,
  tableNumber: null,
  notes: null,
  subtotal: '10.00',
  deliveryFee: '0.00',
  totalAmount: '10.00',
  deliveryZoneName: null,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  changeFor: null,
  cancelReason: null,
  cancelledBy: null,
  guestName: 'Cliente teste',
  guestPhone: null,
  guestStreet: null,
  guestNumber: null,
  guestComplement: null,
  guestNeighborhood: null,
  guestCity: null,
  guestState: null,
  guestZipCode: null,
  acceptedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  createdAt: '2026-08-01T12:00:00.000Z',
  items: [],
  statusHistory: [
    {
      id: 'history-1',
      status: 'PREPARING',
      changedByRealm: 'OPERATIONAL',
      changedById: 'cook-1',
      createdAt: '2026-08-01T12:05:00.000Z',
    },
  ],
}

export const kitchenStaffMock: StaffMember[] = [
  {
    role: 'STAFF',
    user: { id: 'cook-1', name: 'Marina Silva' },
  },
]
