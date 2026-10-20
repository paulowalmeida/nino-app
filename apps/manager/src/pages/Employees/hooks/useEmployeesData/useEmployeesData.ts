import { inviteSeatsOf } from '@pages/Employees/adapters/invite-seats.adapter/invite-seats.adapter'
import {
  courierRosterEntries,
  staffRosterEntries,
} from '@pages/Employees/adapters/team-roster.adapter/team-roster.adapter'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useCouriers } from '@shared/hooks/team/useCouriers/useCouriers'
import { useStaff } from '@shared/hooks/team/useStaff/useStaff'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'
import { useSessionStore } from '@shared/states/session/session.state'
import { assignablePositions } from '@shared/utils/assignable-positions/assignable-positions'

export const useEmployeesData = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const {
    data: staff,
    isPending: isStaffPending,
    isError: isStaffError,
  } = useStaff(unitId)
  const {
    data: couriers,
    isPending: isCourierPending,
    isError: isCourierError,
  } = useCouriers(unitId)
  const { data: positions } = useUnitPositions(unitId)
  const currentUserId = useSessionStore((state) => state.user?.id)
  const assignable = assignablePositions(
    positions ?? [],
    unit?.positionLevel ?? 0
  )

  return {
    unit,
    unitId,
    inviteSeats: inviteSeatsOf(assignable),
    staffEntries: staffRosterEntries(
      staff?.data ?? [],
      currentUserId,
      assignable
    ),
    courierEntries: courierRosterEntries(couriers?.data ?? []),
    isStaffPending,
    isCourierPending,
    isError: isStaffError || isCourierError,
  }
}
