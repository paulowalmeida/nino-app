import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { buildGoogleAuthUrl } from '@pages/sign-in/utils/buildGoogleAuthUrl/buildGoogleAuthUrl'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInGoogleButton } from './SignInGoogleButton'
import { signInGoogleButtonMock } from './SignInGoogleButton.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')
vi.mock('@pages/sign-in/utils/buildGoogleAuthUrl/buildGoogleAuthUrl')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    googleFailed: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInGoogleButton', () => {
  it('offers no google path when the client id is missing', () => {
    // Arrange
    facadeWith({})
    vi.mocked(buildGoogleAuthUrl).mockReturnValue(null)

    // Act
    const { container } = render(<SignInGoogleButton />)

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('links straight to the google authorization url', () => {
    // Arrange
    facadeWith({})
    vi.mocked(buildGoogleAuthUrl).mockReturnValue(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=1'
    )

    // Act
    render(<SignInGoogleButton />)

    // Assert
    expect(
      screen.getByRole('link', { name: 'Continuar com Google' })
    ).toHaveAttribute(
      'href',
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=1'
    )
  })

  it('explains the failure reported by the api redirect', () => {
    // Arrange
    facadeWith({ googleFailed: true })
    vi.mocked(buildGoogleAuthUrl).mockReturnValue(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=1'
    )

    // Act
    render(<SignInGoogleButton />)

    // Assert
    expect(
      screen.getByText(signInGoogleButtonMock.errorMessage)
    ).toBeInTheDocument()
  })
})
