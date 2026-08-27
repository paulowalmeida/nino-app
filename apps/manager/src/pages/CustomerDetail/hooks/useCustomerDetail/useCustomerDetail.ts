import { useQuery } from '@tanstack/react-query'

import { toCustomerAddressRows } from '@pages/CustomerDetail/adapters/customerAddressRows.adapter/customerAddressRows.adapter'
import { queryKeys } from '@shared/lib/query-keys'
import { CustomerService } from '@shared/services/customer/customer.service'

export const useCustomerDetail = (
  tenantId: string | null,
  customerId: string
) => {
  const query = useQuery({
    queryKey: queryKeys.customers.detail(tenantId ?? '', customerId),
    queryFn: () => CustomerService.getById(tenantId as string, customerId),
    enabled: !!tenantId && !!customerId,
  })

  return {
    customer: query.data,
    addressRows: toCustomerAddressRows(query.data?.addresses ?? []),
    isPending: query.isPending,
  }
}
