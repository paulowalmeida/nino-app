import { useQuery } from '@tanstack/react-query'

import { PhoneService } from '@pages/Settings/services/phone/phone.service'
import { queryKeys } from '@shared/lib/query-keys'
import type { TenantPhone } from '@shared/types/settings/tenant-phone'

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
