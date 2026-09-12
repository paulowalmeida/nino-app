import type { Consumer } from '@custom_types/consumer/consumer'

const base: Consumer = {
  id: 'consumer-1',
  name: '11987654321',
  phone: null,
  email: null,
  photoUrl: null,
  cpf: null,
  isActive: true,
  lastLoginAt: null,
  profileCompletedAt: null,
  createdAt: '2026-09-06T12:00:00.000Z',
  updatedAt: '2026-09-06T12:00:00.000Z',
}

export const signInCompleteProfileMock = {
  fromPhone: base,
  fromGoogle: {
    ...base,
    name: 'Ana Souza',
    email: 'ana@gmail.com',
    photoUrl: 'https://lh3.googleusercontent.com/a/ana',
  } satisfies Consumer,
  withPhone: { ...base, phone: '+5511987654321' } satisfies Consumer,
}
