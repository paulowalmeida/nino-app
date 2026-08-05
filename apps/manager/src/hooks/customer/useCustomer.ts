import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CustomerHistory } from '@custom_types/customer/customer-history'
import { CustomerService } from '@services/customer.service'

export const useCustomer = (tenantId: string | null, customerId: string) =>
  useQuery<CustomerHistory>({
    queryKey: queryKeys.customers.detail(tenantId ?? '', customerId),
    queryFn: () => CustomerService.getById(tenantId as string, customerId),
    enabled: !!tenantId && !!customerId,
  })
