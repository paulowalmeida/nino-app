import type { Consumer } from '@custom_types/consumer/consumer'
import type { UpdateMyProfileRequest } from '@custom_types/consumer/update-my-profile-request'
import type { LinkPhoneRequest } from '@shared/types/consumer/link-phone-request'
import type { OtpCredentials } from '@shared/types/consumer/otp-credentials'
import { api } from '@shared/services/http/http.service'

/**
 * Login do cliente é por telefone: pede um código, confirma o código. Não há
 * senha para lembrar nem cadastro antes da primeira compra — o mesmo número
 * que ele já digita no checkout é a identidade dele.
 *
 * O token volta em cookie httpOnly, então nada aqui devolve credencial: quem
 * responde "quem está logado" é o servidor, em `my/consumer`.
 */
export const consumerAuthService = {
  requestOtp: (credentials: OtpCredentials): Promise<{ message: string }> =>
    api.create<OtpCredentials, { message: string }>(
      'consumer/auth/otp/request',
      credentials
    ),
  verifyOtp: (credentials: OtpCredentials, code: string): Promise<Consumer> =>
    api.create<OtpCredentials & { code: string }, Consumer>(
      'consumer/auth/otp/verify',
      { ...credentials, code }
    ),
  requestPhoneLink: (data: LinkPhoneRequest): Promise<{ message: string }> =>
    api.create<LinkPhoneRequest, { message: string }>(
      'consumer/auth/phone/link/request',
      data
    ),
  verifyPhoneLink: (
    data: LinkPhoneRequest & { code: string }
  ): Promise<Consumer> =>
    api.create<LinkPhoneRequest & { code: string }, Consumer>(
      'consumer/auth/phone/link/verify',
      data
    ),
  getMe: (): Promise<Consumer> => api.get<Consumer>('my/consumer'),
  updateMyProfile: (data: UpdateMyProfileRequest): Promise<Consumer> =>
    api.patch<UpdateMyProfileRequest, Consumer>('my/consumer', data),
  logout: (): Promise<{ message: string }> =>
    api.create<Record<string, never>, { message: string }>(
      'consumer/auth/logout',
      {}
    ),
}
