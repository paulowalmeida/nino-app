import type { RosterEntry } from '@custom_types/team/roster-entry'

export const ownerEntry: RosterEntry = {
  id: 'user-1',
  name: 'Weskley Almeida',
  email: 'weskley@nino.delivery',
  role: 'Dono',
  lastLoginAt: null,
  removable: false,
}

export const changeableEntry: RosterEntry = {
  ...ownerEntry,
  id: 'user-2',
  role: 'Gerente',
  roleKey: 'MANAGER',
}

export const teammateEntry: RosterEntry = {
  ...ownerEntry,
  id: 'user-3',
  name: 'Bruna Carvalho',
  email: 'bruna@nino.delivery',
  role: 'Atendente',
}
