import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscriptionInterestFacade } from '../../facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'
import { SubscriptionInterestRequest } from './SubscriptionInterestRequest'
import {
  interestRequestCopyMock,
  interestRequestInputMock,
} from './SubscriptionInterestRequest.mock'

vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock(
  '../../facades/useSubscriptionInterestFacade/useSubscriptionInterestFacade'
)

describe(SubscriptionInterestRequest.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts on the request form', () => {
    // Arrange
    vi.mocked(useSubscriptionInterestFacade).mockReturnValue({
      requestInterest: vi.fn(),
      isRequestingInterest: false,
      isRequestInterestError: false,
    })

    // Act
    render(<SubscriptionInterestRequest />)

    // Assert
    expect(
      screen.getByRole('button', { name: interestRequestCopyMock.submitLabel })
    ).toBeInTheDocument()
    expect(
      screen.queryByText(interestRequestCopyMock.sentTitle)
    ).not.toBeInTheDocument()
  })

  it('confirms the request once it is sent', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.mocked(useSubscriptionInterestFacade).mockReturnValue({
      requestInterest: vi
        .fn()
        .mockImplementation(
          (_input: unknown, options: { onSuccess: () => void }) =>
            options.onSuccess()
        ),
      isRequestingInterest: false,
      isRequestInterestError: false,
    })
    render(<SubscriptionInterestRequest />)

    // Act
    await user.type(screen.getByLabelText(/Nome/), interestRequestInputMock.contactName)
    await user.type(
      screen.getByLabelText(/E-mail/),
      interestRequestInputMock.contactEmail
    )
    await user.type(
      screen.getByLabelText(/Quantidade de unidades/),
      String(interestRequestInputMock.unitCount)
    )
    await user.type(
      screen.getByLabelText(/O que sua operação precisa/),
      interestRequestInputMock.needs
    )
    await user.click(
      screen.getByRole('button', { name: interestRequestCopyMock.submitLabel })
    )

    // Assert
    expect(
      await screen.findByText(interestRequestCopyMock.sentTitle)
    ).toBeInTheDocument()
  })
})
