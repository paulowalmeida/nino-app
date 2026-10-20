import { api } from '@shared/services/http/http.service'
import type { CredentialInfo } from '@shared/types/profile/credential-info'
import type { UpdateEmailRequest } from '@shared/types/profile/update-email-request'
import type { CreateInviteRequest } from '@shared/types/team/create-invite-request'
import type { StaffDetail } from '@shared/types/team/staff-detail'
import type { StaffMember } from '@shared/types/team/staff-member'
import type { StaffPage } from '@shared/types/team/staff-page'

type StaffStatus = 'active' | 'inactive'
type UpdateStaffProfileRequest = { name: string; email: string }

export const StaffService = {
  listStaff: (
    unitId: string,
    status: StaffStatus = 'active'
  ): Promise<StaffPage> =>
    api.get<StaffPage>(`units/${unitId}/staff?status=${status}`),

  getById: (unitId: string, userId: string): Promise<StaffDetail> =>
    api.get<StaffDetail>(`units/${unitId}/staff/${userId}`),

  sendInvite: (
    unitId: string,
    data: CreateInviteRequest
  ): Promise<{ id: string; email: string }> =>
    api.create<CreateInviteRequest, { id: string; email: string }>(
      `units/${unitId}/invites`,
      data
    ),

  updateStaffPosition: (
    unitId: string,
    userId: string,
    positionId: string
  ): Promise<StaffMember> =>
    api.patch<{ positionId: string }, StaffMember>(
      `units/${unitId}/staff/${userId}/role`,
      { positionId }
    ),

  updateStaffEmail: (
    unitId: string,
    userId: string,
    email: string
  ): Promise<CredentialInfo> =>
    api.patch<UpdateEmailRequest, CredentialInfo>(
      `units/${unitId}/staff/${userId}/email`,
      { email }
    ),

  updateStaffProfile: (
    unitId: string,
    userId: string,
    profile: UpdateStaffProfileRequest
  ): Promise<UpdateStaffProfileRequest> =>
    api.patch<UpdateStaffProfileRequest, UpdateStaffProfileRequest>(
      `units/${unitId}/staff/${userId}/profile`,
      profile
    ),

  setStaffActivity: (
    unitId: string,
    userId: string,
    isActive: boolean
  ): Promise<{ message: string }> =>
    api.patch<{ isActive: boolean }, { message: string }>(
      `units/${unitId}/staff/${userId}/activity`,
      { isActive }
    ),

  removeStaff: (unitId: string, userId: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/staff/${userId}`),
}
