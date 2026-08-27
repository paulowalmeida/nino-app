export const tenantIdMock = 'tenant-1'
export const userIdMock = 'user-1'

export const staffPageMock = {
  data: [
    {
      id: userIdMock,
      name: 'Colaborador',
      email: 'colaborador@padoca.com',
      role: 'STAFF' as const,
    },
  ],
  pagination: { total: 1, page: 1, size: 1 },
}

export const staffDetailMock = {
  user: {
    id: userIdMock,
    name: 'Colaborador',
    email: 'colaborador@padoca.com',
  },
  role: 'STAFF' as const,
}

export const createInviteRequestMock = {
  email: 'novo@padoca.com',
  kind: 'STAFF' as const,
  role: 'STAFF' as const,
}

export const inviteResultMock = { id: 'invite-1', email: 'novo@padoca.com' }

export const staffMemberMock = {
  id: userIdMock,
  name: 'Colaborador',
  email: 'colaborador@padoca.com',
  role: 'MANAGER' as const,
}

export const credentialInfoMock = { email: 'novo-email@padoca.com' }

export const removeStaffMessageMock = { message: 'Colaborador removido.' }
