import type { OtpCredentials } from '@shared/types/customer/otp-credentials'
import { toE164 } from '@utils/phone'
import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'

export const resolveOtpCredentials = (
  channel: SignInChannel,
  phone: string,
  email: string
): OtpCredentials =>
  channel === 'email' ? { email: email.trim() } : { phone: toE164(phone) }
