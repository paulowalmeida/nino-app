import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { OpeningHours } from '@custom_types/settings'
import {
  createOpeningHours,
  listOpeningHours,
  updateOpeningHours,
} from '@services/tenant/settings.service'

type HoursDraft = {
  id?: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

/** Stable identity so consumers can compare snapshots by reference. */
const NONE: OpeningHours[] = []

const hoursKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'opening-hours',
]

export const useOpeningHours = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: hoursKey(tenantId ?? ''),
    queryFn: () => listOpeningHours(tenantId as string),
    enabled: !!tenantId,
  })

  const hours: OpeningHours[] = query.data?.data ?? NONE

  return { ...query, hours }
}

/**
 * One entry per weekday: creates it the first time the day is filled in,
 * updates it from then on. The API keys `(tenantId, dayOfWeek)` as unique.
 */
export const useSaveOpeningHours = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dayOfWeek, openTime, closeTime, isOpen }: HoursDraft) =>
      id
        ? updateOpeningHours(tenantId as string, id, {
            openTime,
            closeTime,
            isOpen,
          })
        : createOpeningHours(tenantId as string, {
            dayOfWeek,
            openTime,
            closeTime,
          }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hoursKey(tenantId ?? '') })
    },
  })
}
