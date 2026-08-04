import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { HoursDraft } from '@custom_types/settings/hours-draft'
import { OpeningHoursService } from '@services/opening-hours.service'

import { hoursKey } from './useOpeningHours'

/**
 * One entry per weekday: creates it the first time the day is filled in,
 * updates it from then on. The API keys `(tenantId, dayOfWeek)` as unique.
 */
const persistDay = (
  tenantId: string,
  { id, dayOfWeek, openTime, closeTime, isOpen }: HoursDraft
) =>
  id
    ? OpeningHoursService.updateOpeningHours(tenantId, id, {
        openTime,
        closeTime,
        isOpen,
      })
    : OpeningHoursService.createOpeningHours(tenantId, {
        dayOfWeek,
        openTime,
        closeTime,
        isOpen,
      })

/**
 * The week is saved as one action — the store decides its schedule as a
 * whole, not day by day. Days are written in parallel; a single failure
 * fails the batch and keeps the form dirty.
 */
export const useSaveWeek = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Horários salvos',
      errorTitle: 'Os horários não foram salvos',
    },
    mutationFn: (week: HoursDraft[]) =>
      Promise.all(week.map((day) => persistDay(tenantId as string, day))),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hoursKey(tenantId ?? '') })
    },
  })
}
