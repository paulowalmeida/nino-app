import type { Customer } from '@custom_types/customer/customer'
import { useProfileFacadeMock } from '@pages/Profile/facades/useProfileFacade/useProfileFacade.mock'

export const accountProfilePhoneFieldMock = {
  customerWithPhone: useProfileFacadeMock.customer,
  customerWithoutPhone: {
    ...useProfileFacadeMock.customer,
    phone: null,
  } satisfies Customer,
}
