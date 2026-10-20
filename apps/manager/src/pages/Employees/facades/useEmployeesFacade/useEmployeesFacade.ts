import { useEmployeesData } from '@pages/Employees/hooks/useEmployeesData/useEmployeesData'
import { useInvite } from '@shared/hooks/team/useInvite/useInvite'
import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffPosition } from '@shared/hooks/team/useUpdateStaffPosition/useUpdateStaffPosition'
import { useUpdateStaffProfile } from '@shared/hooks/team/useUpdateStaffProfile/useUpdateStaffProfile'
import { useSetStaffActivity } from '@shared/hooks/team/useSetStaffActivity/useSetStaffActivity'

export const useEmployeesFacade = () => {
  const data = useEmployeesData()
  const invite = useInvite(data.unitId)
  const removeMember = useRemoveMember(data.unitId)
  const updateEmail = useUpdateStaffEmail(data.unitId)
  const updatePosition = useUpdateStaffPosition(data.unitId)
  const updateProfile = useUpdateStaffProfile(data.unitId)
  const setActivity = useSetStaffActivity(data.unitId)

  return {
    ...data,
    invite: invite.mutateAsync,
    updateStaffEmail: updateEmail.mutateAsync,
    updateStaffProfile: updateProfile.mutateAsync,
    setStaffActivity: setActivity.mutate,
    activityVariables: setActivity.variables,
    isChangingActivity: setActivity.isPending,
    removeMember: removeMember.mutate,
    removingVariables: removeMember.variables,
    isRemoving: removeMember.isPending,
    changePosition: updatePosition.mutate,
    positionVariables: updatePosition.variables,
    isChangingPosition: updatePosition.isPending,
  }
}
