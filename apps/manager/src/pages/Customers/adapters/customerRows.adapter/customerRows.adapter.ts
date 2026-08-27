import type { CustomerRowModel } from '@pages/Customers/types/CustomerRowModel.type'
import type { TenantCustomer } from '@shared/types/customer/tenant-customer'
import { brl } from '@shared/utils/money/money'
import { formatPhone } from '@shared/utils/phone/phone'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
})

export const toCustomerRows = (
  customers: TenantCustomer[]
): CustomerRowModel[] =>
  customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phoneLabel: formatPhone(customer.phone),
    spentLabel: brl(customer.spent),
    ordersCount: String(customer.orders),
    ordersLabel: customer.orders === 1 ? ' pedido' : ' pedidos',
    pointsLabel: String(customer.loyaltyPoints),
    sinceLabel: day.format(new Date(customer.since)),
  }))
