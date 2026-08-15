import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TopCustomer } from '@custom_types/customer/top-customer'
import type {
  TopCustomerMetric,
} from '@custom_types/customer/top-customer-metric'
import { CustomerService } from '@services/customer.service'

/** Ranking, não fila de trabalho: sem polling, como o relatório de vendas. */
export const useTopCustomers = (
  tenantId: string | null,
  metric: TopCustomerMetric,
  limit: number
) => {
  const query = useQuery<TopCustomer[]>({
    queryKey: queryKeys.customers.top(tenantId ?? '', metric),
    queryFn: () =>
      CustomerService.getTopCustomers(tenantId as string, metric, limit),
    enabled: !!tenantId,
  })

  return { ...query, topCustomers: query.data ?? [] }
}
