import { api } from '@shared/services/http/http.service'
import type { UnitRole } from '@shared/types/auth/unit-role'
import type { CredentialInfo } from '@shared/types/profile/credential-info'
import type { UpdateEmailRequest } from '@shared/types/profile/update-email-request'
import type { CreateInviteRequest } from '@shared/types/team/create-invite-request'
import type { StaffDetail } from '@shared/types/team/staff-detail'
import type { StaffMember } from '@shared/types/team/staff-member'
import type { StaffPage } from '@shared/types/team/staff-page'

export const StaffService = {
  listStaff: (unitId: string): Promise<StaffPage> =>
    api.get<StaffPage>(`units/${unitId}/staff`),

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

  updateStaffRole: (
    unitId: string,
    userId: string,
    role: UnitRole
  ): Promise<StaffMember> =>
    api.patch<{ role: UnitRole }, StaffMember>(
      `units/${unitId}/staff/${userId}/role`,
      { role }
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

  removeStaff: (
    unitId: string,
    userId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/staff/${userId}`),
}
