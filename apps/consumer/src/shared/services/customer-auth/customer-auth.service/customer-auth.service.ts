import type { Customer } from '@custom_types/customer/customer'
import type { UpdateMyProfileRequest } from '@custom_types/customer/update-my-profile-request'
import type { LinkPhoneRequest } from '@shared/types/customer/link-phone-request'
import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { api } from '@shared/services/http/http.service'

/**
 * Login do cliente é por telefone: pede um código, confirma o código. Não há
 * senha para lembrar nem cadastro antes da primeira compra — o mesmo número
 * que ele já digita no checkout é a identidade dele.
 *
 * O token volta em cookie httpOnly, então nada aqui devolve credencial: quem
 * responde "quem está logado" é o servidor, em `my/customer`.
 */
export const customerAuthService = {
  requestOtp: (credentials: OtpCredentials): Promise<{ message: string }> =>
    api.create<OtpCredentials, { message: string }>(
      'customer/auth/otp/request',
      credentials
    ),
  verifyOtp: (credentials: OtpCredentials, code: string): Promise<Customer> =>
    api.create<OtpCredentials & { code: string }, Customer>(
      'customer/auth/otp/verify',
      { ...credentials, code }
    ),
  signInWithGoogle: (idToken: string): Promise<Customer> =>
    api.create<{ idToken: string }, Customer>('customer/auth/google', {
      idToken,
    }),
  requestPhoneLink: (data: LinkPhoneRequest): Promise<{ message: string }> =>
    api.create<LinkPhoneRequest, { message: string }>(
      'customer/auth/phone/link/request',
      data
    ),
  verifyPhoneLink: (
    data: LinkPhoneRequest & { code: string }
  ): Promise<Customer> =>
    api.create<LinkPhoneRequest & { code: string }, Customer>(
      'customer/auth/phone/link/verify',
      data
    ),
  getMe: (): Promise<Customer> => api.get<Customer>('my/customer'),
  updateMyProfile: (data: UpdateMyProfileRequest): Promise<Customer> =>
    api.patch<UpdateMyProfileRequest, Customer>('my/customer', data),
  logout: (): Promise<{ message: string }> =>
    api.create<Record<string, never>, { message: string }>(
      'customer/auth/logout',
      {}
    ),
}
