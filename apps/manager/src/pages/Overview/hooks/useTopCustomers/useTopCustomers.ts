import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { CustomerService } from '@shared/services/customer/customer.service'
import type { TopCustomer } from '@shared/types/customer/top-customer'
import type {
  TopCustomerMetric,
} from '@shared/types/customer/top-customer-metric'

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
