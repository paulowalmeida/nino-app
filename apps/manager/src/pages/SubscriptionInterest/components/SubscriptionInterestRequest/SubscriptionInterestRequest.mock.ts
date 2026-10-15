import type { CreateSubscriptionInterestInput } from '@shared/types/profile/subscription-interest'

export const interestRequestCopyMock = {
  submitLabel: 'Enviar solicitação',
  sentTitle: 'Solicitação enviada',
}

export const interestRequestInputMock = {
  contactName: 'Paulo',
  contactEmail: 'paulo@nino.delivery',
  preferredContactMethod: 'EMAIL',
  unitCount: 12,
  needs: 'Operação com várias unidades',
} satisfies CreateSubscriptionInterestInput
