import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantPhone } from '@custom_types/settings'
import { PhoneService } from '@services/phone.service'

const phonesKey = (tenantId: string) => [
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

export const usePhoneMutations = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: phonesKey(tenantId ?? '') })
  }

  const add = useMutation({
    meta: {
      success: 'Telefone adicionado',
      errorTitle: 'O telefone não foi adicionado',
    },
    mutationFn: (phone: string) => PhoneService.createPhone(tenantId as string, phone),
    onSuccess: invalidate,
  })

  const edit = useMutation({
    meta: { success: 'Telefone salvo', errorTitle: 'O telefone não foi salvo' },
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      PhoneService.updatePhone(tenantId as string, id, phone),
    onSuccess: invalidate,
  })

  const drop = useMutation({
    meta: {
      success: 'Telefone removido',
      errorTitle: 'O telefone não foi removido',
    },
    mutationFn: (id: string) => PhoneService.removePhone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, drop }
}
