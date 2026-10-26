import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInMethods } from './SignInMethods'
import { signInMethodsMock } from './SignInMethods.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')
vi.mock(
  '@pages/sign-in/components/SignInGoogleButton/SignInGoogleButton',
  () => ({
    SignInGoogleButton: () => null,
  })
)

const setChannel = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    store: signInMethodsMock.store,
    setChannel,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInMethods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('names the store the person is signing in to', () => {
    facadeWith({})

    render(<SignInMethods />)

    expect(
      screen.getByText(/Burgão do Nino — Centro/, { selector: 'p' })
    ).toBeInTheDocument()
  })

  it('still invites the person in before the store is known', () => {
    facadeWith({ store: undefined })

    render(<SignInMethods />)

    expect(screen.getByText('Entre para fazer seu pedido.')).toBeInTheDocument()
  })

  it('opens the phone field from the phone option', async () => {
    // Arrange
    facadeWith({})
    render(<SignInMethods />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: signInMethodsMock.phoneOption })
    )

    // Assert
    expect(setChannel).toHaveBeenCalledWith('phone')
  })

  it('opens the email field from the email option', async () => {
    // Arrange
    facadeWith({})
    render(<SignInMethods />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: signInMethodsMock.emailOption })
    )

    // Assert
    expect(setChannel).toHaveBeenCalledWith('email')
  })
})
