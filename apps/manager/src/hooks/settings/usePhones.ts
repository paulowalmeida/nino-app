import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantPhone } from '@custom_types/settings'
import {
  createPhone,
  listPhones,
  removePhone,
} from '@services/tenant/settings.service'

const phonesKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'phones',
]

export const usePhones = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: phonesKey(tenantId ?? ''),
    queryFn: () => listPhones(tenantId as string),
    enabled: !!tenantId,
  })

  const phones: TenantPhone[] = query.data?.data ?? []

  return { ...query, phones }
}

export const usePhoneMutations = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: phonesKey(tenantId ?? '') })
  }

  const add = useMutation({
    mutationFn: (phone: string) => createPhone(tenantId as string, phone),
    onSuccess: invalidate,
  })

  const drop = useMutation({
    mutationFn: (id: string) => removePhone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, drop }
}
