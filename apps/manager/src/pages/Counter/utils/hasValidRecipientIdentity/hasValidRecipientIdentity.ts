import type { Recipient } from '@shared/types/order/recipient'

export const hasValidRecipientIdentity = (recipient: Recipient): boolean => {
  const nameLength = recipient.name.trim().length
  const phoneDigits = recipient.phone.replace(/\D/g, '')
  const phoneLength = phoneDigits.length
  const localPhone = phoneDigits.slice(2)
  const isValidPhone =
    (phoneLength === 10 && /^[2-5]/.test(localPhone)) ||
    (phoneLength === 11 && localPhone.startsWith('9'))

  return nameLength >= 3 && isValidPhone
}
