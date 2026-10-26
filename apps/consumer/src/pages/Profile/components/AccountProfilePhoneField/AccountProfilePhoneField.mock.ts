import type { Consumer } from '@custom_types/consumer/consumer'
import { useProfileFacadeMock } from '@pages/Profile/facades/useProfileFacade/useProfileFacade.mock'

export const accountProfilePhoneFieldMock = {
  consumerWithPhone: useProfileFacadeMock.consumer,
  consumerWithoutPhone: {
    ...useProfileFacadeMock.consumer,
    phone: null,
  } satisfies Consumer,
}
