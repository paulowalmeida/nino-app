export const loginRequestMock = {
  email: 'dono@padoca.com',
  password: 'senha-segura',
}

export const signupRequestMock = {
  account: {
    name: 'Dono da Padoca',
    email: 'dono@padoca.com',
    password: 'senha-segura',
    cpf: '12345678900',
    phone: '11999990000',
  },
  company: {
    name: 'Padoca do Bairro',
    cnpj: '12345678000199',
  },
  unit: {
    slug: 'padoca-do-bairro',
    zipCode: '66000000',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'Belém',
    state: 'PA',
  },
}

export const checkAvailabilityRequestMock = {
  email: 'dono@padoca.com',
}

export const authUserMock = {
  id: 'user-1',
  name: 'Dono da Padoca',
  email: 'dono@padoca.com',
}

export const meResponseMock = {
  ...authUserMock,
  memberships: [{ unitId: 'unit-1', role: 'OWNER' }],
}

export const checkAvailabilityResponseMock = {
  emailAvailable: true,
}

export const forgotPasswordRequestMock = {
  email: 'dono@padoca.com',
}

export const resetPasswordRequestMock = {
  token: 'raw-token',
  password: 'nova-senha',
}

export const messageResponseMock = {
  message: 'ok',
}
