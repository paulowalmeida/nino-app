import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'

export const OTP_CODE_LENGTH = 6

export const SIGN_IN_CHANNELS: { id: SignInChannel; label: string }[] = [
  { id: 'phone', label: 'Telefone' },
  { id: 'email', label: 'E-mail' },
]
