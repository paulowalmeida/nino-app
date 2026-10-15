import type { CreateSubscriptionInterestInput } from '@shared/types/profile/subscription-interest'

export const filledInterestMock = {
  contactName: 'Paulo',
  contactEmail: 'paulo@nino.delivery',
  unitCount: '12',
  needs: 'Operação com várias unidades',
}

export const expectedInterestInputMock = {
  contactName: 'Paulo',
  contactEmail: 'paulo@nino.delivery',
  contactPhone: undefined,
  preferredContactMethod: 'EMAIL',
  unitCount: 12,
  needs: 'Operação com várias unidades',
  desiredFeatures: undefined,
} satisfies CreateSubscriptionInterestInput

export const whatsappContactMock = {
  phone: '91988880000',
  desiredFeatures: 'Integração com iFood',
}

export const expectedWhatsappInterestInputMock = {
  ...expectedInterestInputMock,
  contactPhone: '(91) 98888-0000',
  preferredContactMethod: 'WHATSAPP',
  desiredFeatures: 'Integração com iFood',
} satisfies CreateSubscriptionInterestInput
