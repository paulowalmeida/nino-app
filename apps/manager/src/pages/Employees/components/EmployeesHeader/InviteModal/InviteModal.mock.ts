import type { InviteSeat } from '@pages/Employees/adapters/invite-seats.adapter/invite-seats.adapter'

export const inviteModalMock = {
  email: 'ana@example.com',
  submitLabel: 'Enviar convite',
}

export const inviteModalSeatsMock: InviteSeat[] = [
  { value: 'position-staff', label: 'Atendente' },
  { value: 'position-manager', label: 'Gerente' },
  { value: 'COURIER', label: 'Entregador' },
]
