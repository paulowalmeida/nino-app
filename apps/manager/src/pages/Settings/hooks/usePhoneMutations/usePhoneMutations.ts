import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PhoneService } from '@pages/Settings/services/phone/phone.service'

import { phonesKey } from '../usePhones/usePhones'

export const usePhoneMutations = (unitId: string | null) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: phonesKey(unitId ?? '') })
  }

  const add = useMutation({
    meta: {
      success: 'Telefone adicionado',
      errorTitle: 'O telefone não foi adicionado',
    },
    mutationFn: (phone: string) =>
      PhoneService.createPhone(unitId as string, phone),
    onSuccess: invalidate,
  })

  const edit = useMutation({
    meta: {
      success: 'Telefone salvo',
      errorTitle: 'O telefone não foi salvo',
    },
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      PhoneService.updatePhone(unitId as string, id, phone),
    onSuccess: invalidate,
  })

  const drop = useMutation({
    meta: {
      success: 'Telefone removido',
      errorTitle: 'O telefone não foi removido',
    },
    mutationFn: (id: string) =>
      PhoneService.removePhone(unitId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, drop }
}
