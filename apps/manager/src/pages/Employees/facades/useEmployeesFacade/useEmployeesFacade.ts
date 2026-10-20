import { useEmployeesData } from '@pages/Employees/hooks/useEmployeesData/useEmployeesData'
import { useInvite } from '@shared/hooks/team/useInvite/useInvite'
import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffPosition } from '@shared/hooks/team/useUpdateStaffPosition/useUpdateStaffPosition'

export const useEmployeesFacade = () => {
  const data = useEmployeesData()
  const invite = useInvite(data.unitId)
  const removeMember = useRemoveMember(data.unitId)
  const updateEmail = useUpdateStaffEmail(data.unitId)
  const updatePosition = useUpdateStaffPosition(data.unitId)

  return {
    ...data,
    invite: invite.mutateAsync,
    updateStaffEmail: updateEmail.mutateAsync,
    removeMember: removeMember.mutate,
    removingVariables: removeMember.variables,
    isRemoving: removeMember.isPending,
    changePosition: updatePosition.mutate,
    positionVariables: updatePosition.variables,
    isChangingPosition: updatePosition.isPending,
  }
}
