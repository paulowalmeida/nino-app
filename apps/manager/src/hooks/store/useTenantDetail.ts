import { useNavigate } from 'react-router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantDetail, UpdateTenantRequest } from '@custom_types/store'
import { TenantService } from '@services/tenant.service'
import { useSessionStore } from '@states/useSessionStore'

const detailKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'detail',
]

export const useTenantDetail = (tenantId: string | null) =>
  useQuery<TenantDetail>({
    queryKey: detailKey(tenantId ?? ''),
    queryFn: () => TenantService.getById(tenantId as string),
    enabled: !!tenantId,
  })

export const useSaveTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UpdateTenantRequest) =>
      TenantService.updateTenant(tenantId as string, data),
    onSuccess: (tenant) =>
      queryClient.setQueryData(detailKey(tenantId ?? ''), tenant),
  })
}

/**
 * Remover unidade muda a lista de lojas da sessão — por isso a sessão é
 * limpa e a raiz reencaminha para a que sobrou.
 */
export const useRemoveTenant = () => {
  const navigate = useNavigate()

  return useMutation({
    meta: {
      success: 'Loja fechada',
      errorTitle: 'Não deu pra fechar a loja',
    },
    mutationFn: (tenantId: string) => TenantService.removeTenant(tenantId),
    onSuccess: () => {
      useSessionStore.getState().clear()
      void navigate('/')
    },
  })
}

/** Promove a unidade a matriz da empresa. */
export const useSetMainTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
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
}
