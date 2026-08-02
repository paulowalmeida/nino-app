import type { CredentialInfo, UpdateEmailRequest } from '@custom_types/account'
import type { TenantRole } from '@custom_types/auth'
import type {
  CourierPage,
  CreateInviteRequest,
  StaffMember,
  StaffPage,
} from '@custom_types/team'
import { ApiFactory } from '@services/api/api.service'

const { get, create, patch, remove } = ApiFactory()

export const listStaff = (tenantId: string): Promise<StaffPage> =>
  get<StaffPage>(`tenants/${tenantId}/staff`)

export const listCouriers = (tenantId: string): Promise<CourierPage> =>
  get<CourierPage>(`tenants/${tenantId}/couriers`)

/**
 * O convite chega por e-mail: quem aceita entra na loja com o papel escolhido
 * aqui. Nada é criado até a aceitação.
 */
export const sendInvite = (
  tenantId: string,
  data: CreateInviteRequest
): Promise<{ id: string; email: string }> =>
  create<CreateInviteRequest, { id: string; email: string }>(
    `tenants/${tenantId}/invites`,
    data
  )

/**
 * Troca o cargo de quem já está na loja. A API recusa rebaixar o último dono e
 * recusa quem tenta mudar o próprio cargo — a tela esconde os dois casos, mas
 * quem decide é o servidor.
 */
export const updateStaffRole = (
  tenantId: string,
  userId: string,
  role: TenantRole
): Promise<StaffMember> =>
  patch<{ role: TenantRole }, StaffMember>(
    `tenants/${tenantId}/staff/${userId}`,
    'role',
    { role }
  )

export const updateStaffEmail = (
  tenantId: string,
  userId: string,
  email: string
): Promise<CredentialInfo> =>
  patch<UpdateEmailRequest, CredentialInfo>(
    `tenants/${tenantId}/staff/${userId}`,
    'email',
    { email }
  )

export const removeStaff = (
  tenantId: string,
  userId: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(`tenants/${tenantId}/staff`, userId)

export const removeCourier = (
  tenantId: string,
  courierId: string
): Promise<{ message: string }> =>
  remove<{ message: string }>(`tenants/${tenantId}/couriers`, courierId)
