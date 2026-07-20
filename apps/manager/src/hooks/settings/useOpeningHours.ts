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
const persistDay = (
  tenantId: string,
  { id, dayOfWeek, openTime, closeTime, isOpen }: HoursDraft
) =>
  id
    ? updateOpeningHours(tenantId, id, { openTime, closeTime, isOpen })
    : createOpeningHours(tenantId, { dayOfWeek, openTime, closeTime })

/**
 * The week is saved as one action — the store decides its schedule as a
 * whole, not day by day. Days are written in parallel; a single failure
 * fails the batch and keeps the form dirty.
 */
export const useSaveWeek = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (week: HoursDraft[]) =>
      Promise.all(week.map((day) => persistDay(tenantId as string, day))),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hoursKey(tenantId ?? '') })
    },
  })
}
