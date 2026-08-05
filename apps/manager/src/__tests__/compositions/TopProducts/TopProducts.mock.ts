import type { SalesReport } from '@custom_types/order/sales-report'
export const salesReportWithProducts: SalesReport = {
  revenue: 540,
  orderCount: 30,
  averageTicket: 18,
  topProducts: [
    {
      productId: 'item-1',
      name: 'Coxinha',
      quantity: 40,
      unitPrice: 8.5,
      revenue: 340,
    },
    {
      productId: 'item-2',
      name: 'Refrigerante lata',
      quantity: 20,
      unitPrice: 6,
      revenue: 120,
    },
  ],
}

export const salesReportWithoutProducts: SalesReport = {
  revenue: 0,
  orderCount: 0,
  averageTicket: 0,
  topProducts: [],
}
