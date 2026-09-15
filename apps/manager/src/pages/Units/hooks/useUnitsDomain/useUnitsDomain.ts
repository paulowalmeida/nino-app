import { useNavigate } from 'react-router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSubscription } from '@shared/hooks/account/useSubscription/useSubscription'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'
import { useSessionStore } from '@shared/states/session/session.state'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

const detailKey = (unitId: string) => [
  ...queryKeys.unit.all(unitId),
  'detail',
]

export const useUnitsDomain = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const groups = useCompanyGroups()
  const units = groups.flatMap(({ units: list }) => list)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: subscription, isPending: isLimitPending } = useSubscription()

  const detail = useQuery<UnitDetail>({
    queryKey: detailKey(unitId ?? ''),
    queryFn: () => UnitService.getById(unitId as string),
    enabled: !!unitId,
  })
  const save = useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UnitDraft) =>
      UnitService.saveUnit(unitId as string, data),
    onSuccess: (saved) =>
      queryClient.setQueryData(detailKey(unitId ?? ''), saved),
  })
  const setMain = useMutation({
    meta: {
      success: 'Unidade definida como matriz',
      errorTitle: 'Não deu pra definir a matriz',
    },
    mutationFn: (id: string) => UnitService.setMainUnit(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.unit.all(unitId ?? ''),
      })
    },
  })
  const remove = useMutation({
    meta: { success: 'Loja fechada', errorTitle: 'Não deu pra fechar a loja' },
    mutationFn: (id: string) => UnitService.removeUnit(id),
    onSuccess: () => {
      useSessionStore.getState().clear()
      void navigate('/')
    },
  })
  const limit = subscription?.plan.maxUnits ?? null

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
