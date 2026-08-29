import type { OtpCredentials } from '@services/customer-auth.service'
import { toE164 } from '@utils/phone'
import type { SignInChannel } from '@pages/sign-in/types/SignInChannel.type'

export const resolveOtpCredentials = (
  channel: SignInChannel,
  phone: string,
  email: string
): OtpCredentials =>
  channel === 'email' ? { email } : { phone: toE164(phone) }
