import type { Customer } from '@custom_types/customer/customer'
import type { UpdateMyProfileRequest } from '@custom_types/customer/update-my-profile-request'
import { get, patch, post } from '@services/api/api.service'

/**
 * Login do cliente é por telefone: pede um código, confirma o código. Não há
 * senha para lembrar nem cadastro antes da primeira compra — o mesmo número
 * que ele já digita no checkout é a identidade dele.
 *
 * O token volta em cookie httpOnly, então nada aqui devolve credencial: quem
 * responde "quem está logado" é o servidor, em `my/customer`.
 */
/** Telefone ou e-mail, nunca os dois — a API recusa o corpo ambíguo. */
export type OtpCredentials = { phone?: string; email?: string }

export const requestOtp = (
  credentials: OtpCredentials
): Promise<{ message: string }> =>
  post<OtpCredentials, { message: string }>(
    'customer/auth/otp/request',
    credentials
  )

export const verifyOtp = (
  credentials: OtpCredentials,
  code: string
): Promise<Customer> =>
  post<OtpCredentials & { code: string }, Customer>(
    'customer/auth/otp/verify',
    { ...credentials, code }
  )

export const getMe = (): Promise<Customer> => get<Customer>('my/customer')

export const updateMyProfile = (
  data: UpdateMyProfileRequest
): Promise<Customer> =>
  patch<UpdateMyProfileRequest, Customer>('my/customer', data)

export const logout = (): Promise<{ message: string }> =>
  post<Record<string, never>, { message: string }>('customer/auth/logout', {})
