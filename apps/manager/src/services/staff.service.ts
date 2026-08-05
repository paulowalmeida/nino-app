import type { CredentialInfo } from '@custom_types/account/credential-info'
import type { UpdateEmailRequest } from '@custom_types/account/update-email-request'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import type { CreateInviteRequest } from '@custom_types/team/create-invite-request'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import type { StaffMember } from '@custom_types/team/staff-member'
import type { StaffPage } from '@custom_types/team/staff-page'
import { api } from '@services/http.service'

export const StaffService = {
  listStaff: (tenantId: string): Promise<StaffPage> =>
    api.get<StaffPage>(`tenants/${tenantId}/staff`),

  getById: (tenantId: string, userId: string): Promise<StaffDetail> =>
    api.get<StaffDetail>(`tenants/${tenantId}/staff/${userId}`),

  sendInvite: (
    tenantId: string,
    data: CreateInviteRequest
  ): Promise<{ id: string; email: string }> =>
    api.create<CreateInviteRequest, { id: string; email: string }>(
      `tenants/${tenantId}/invites`,
      data
    ),

  updateStaffRole: (
    tenantId: string,
    userId: string,
    role: TenantRole
  ): Promise<StaffMember> =>
    api.patch<{ role: TenantRole }, StaffMember>(
      `tenants/${tenantId}/staff/${userId}`,
      'role',
      { role }
    ),

  updateStaffEmail: (
    tenantId: string,
    userId: string,
    email: string
  ): Promise<CredentialInfo> =>
    api.patch<UpdateEmailRequest, CredentialInfo>(
      `tenants/${tenantId}/staff/${userId}`,
      'email',
      { email }
    ),

  removeStaff: (
    tenantId: string,
    userId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/staff`, userId),
}
