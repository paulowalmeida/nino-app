import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

export const tenantAccountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

export const tenantCompanyMock: SignupCompany = {
  name: 'Padoca do Bairro',
  cnpj: '12345678000199',
}

export const tenantValuesMock: FirstStoreFormValues = {
  customName: 'Padoca Centro',
  slug: 'padoca-centro',
  typeId: '',
  zipCode: '66000-000',
  street: 'Rua Central',
  number: '42',
  complement: '',
  neighborhood: 'Centro',
  city: 'Belém',
  state: 'PA',
}

export const tenantFormMock = {
  home: '/',
  failureMessage:
    'Não foi possível concluir. Confira os dados e tente de novo.',
}
