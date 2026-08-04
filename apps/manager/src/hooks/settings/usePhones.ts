import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantPhone } from '@custom_types/settings'
import { PhoneService } from '@services/phone.service'

export const phonesKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'phones',
]

export const usePhones = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: phonesKey(tenantId ?? ''),
    queryFn: () => PhoneService.listPhones(tenantId as string),
    enabled: !!tenantId,
  })

  const phones: TenantPhone[] = query.data?.data ?? []

  return { ...query, phones }
}
