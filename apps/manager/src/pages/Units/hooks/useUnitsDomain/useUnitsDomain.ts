import { useNavigate } from 'react-router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { queryKeys } from '@shared/lib/query-keys'
import { TenantService } from '@shared/services/tenant/tenant.service'
import { useSessionStore } from '@shared/states/session/session.state'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

const detailKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'detail',
]

export const useUnitsDomain = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const groups = useCompanyGroups()
  const units = groups.flatMap(({ units: list }) => list)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: subscription, isPending: isLimitPending } = useSubscription()

  const detail = useQuery<TenantDetail>({
    queryKey: detailKey(tenantId ?? ''),
    queryFn: () => TenantService.getById(tenantId as string),
    enabled: !!tenantId,
  })
  const save = useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UnitDraft) =>
      TenantService.saveTenant(tenantId as string, data),
    onSuccess: (saved) =>
      queryClient.setQueryData(detailKey(tenantId ?? ''), saved),
  })
  const setMain = useMutation({
    meta: {
      success: 'Unidade definida como matriz',
      errorTitle: 'Não deu pra definir a matriz',
    },
    mutationFn: (id: string) => TenantService.setMainTenant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tenant.all(tenantId ?? ''),
      })
    },
  })
  const remove = useMutation({
    meta: { success: 'Loja fechada', errorTitle: 'Não deu pra fechar a loja' },
    mutationFn: (id: string) => TenantService.removeTenant(id),
    onSuccess: () => {
      useSessionStore.getState().clear()
      void navigate('/')
    },
  })
  const limit = subscription?.plan.maxTenants ?? null

  return {
    groups,
    detail,
    save,
    setMain,
    remove,
    limit: {
      limit,
      planName: subscription?.plan.name ?? '',
      isFull: limit !== null && units.length >= limit,
      isPending: isLimitPending,
    },
  }
}
