import type {
  CourierPage,
  CreateInviteRequest,
  StaffPage,
} from '@custom_types/team'
import { ApiFactory } from '@services/api/api.service'

const { get, create, remove } = ApiFactory()

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
