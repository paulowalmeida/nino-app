import { useQuery } from '@tanstack/react-query'

import { PhoneService } from '@pages/Settings/services/phone/phone.service'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import type { UnitPhone } from '@shared/types/settings/unit-phone'

export const phonesKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'phones',
]

export const usePhones = (unitId: string | null) => {
  const query = useQuery({
    queryKey: phonesKey(unitId ?? ''),
    queryFn: () => PhoneService.listPhones(unitId as string),
    enabled: !!unitId,
  })

  const phones: UnitPhone[] = query.data?.data ?? []

  return { ...query, phones }
}
