import type { RosterEntry } from '@shared/types/team/roster-entry'

export const teamRosterMock = {
  title: 'No painel',
  memberName: 'Ana Souza',
}

export const teamRosterPromotableEntryMock: RosterEntry = {
  id: 'user-2',
  name: 'Caio Dias',
  email: 'caio@example.com',
  role: 'Atendente',
  promotionOptions: [{ id: 'position-manager', label: 'Gerente' }],
  lastLoginAt: null,
  removable: true,
}

export const teamRosterLockedEntryMock: RosterEntry = {
  ...teamRosterPromotableEntryMock,
  id: 'user-1',
  name: 'Ana Souza',
  roleLocked: 'Você não pode mudar o próprio cargo',
}

export const teamRosterEditableEntryMock: RosterEntry = {
  id: 'user-3',
  name: 'Duda Reis',
  email: 'duda@example.com',
  role: 'Gerente',
  href: 'user-3',
  lastLoginAt: '2026-01-01T00:00:00.000Z',
  removable: true,
  emailEditable: true,
}

export const teamRosterCourierEntryMock: RosterEntry = {
  id: 'courier-1',
  name: 'Beto Lima',
  email: null,
  role: 'Ativo',
  lastLoginAt: null,
  quiet: true,
  removable: true,
}

export const teamRosterFixedEntryMock: RosterEntry = {
  id: 'user-9',
  name: 'Fixo Dono',
  email: 'dono@example.com',
  role: 'Dono',
  lastLoginAt: null,
  removable: false,
}
