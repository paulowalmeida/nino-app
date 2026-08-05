import type { CreateInviteRequest } from '@custom_types/team/create-invite-request'

export const INVITE_FORM_SEATS = [
  { value: 'STAFF', label: 'Atendente — vê e move pedidos' },
  { value: 'MANAGER', label: 'Gerente — também mexe no cardápio' },
  { value: 'COURIER', label: 'Entregador — recebe as entregas' },
]

export const INVITE_FORM_REQUEST_OF: Record<
  string,
  CreateInviteRequest['kind']
> = {
  STAFF: 'STAFF',
  MANAGER: 'STAFF',
  COURIER: 'COURIER',
}
