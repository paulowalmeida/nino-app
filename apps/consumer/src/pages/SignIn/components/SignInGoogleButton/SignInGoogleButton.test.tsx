import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useGoogleIdentity } from '@pages/sign-in/hooks/useGoogleIdentity/useGoogleIdentity'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInGoogleButton } from './SignInGoogleButton'
import { signInGoogleButtonMock } from './SignInGoogleButton.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')
vi.mock('@pages/sign-in/hooks/useGoogleIdentity/useGoogleIdentity')

const signInWithGoogle = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    signInWithGoogle,
    isSigningInWithGoogle: false,
    googleFailed: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

const identityWith = (isConfigured: boolean) =>
  vi.mocked(useGoogleIdentity).mockReturnValue({
    containerRef: { current: null },
    isReady: isConfigured,
    isConfigured,
  } as unknown as ReturnType<typeof useGoogleIdentity>)

describe('SignInGoogleButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('offers no google path when the client id is missing', () => {
    // Arrange
    facadeWith({})
    identityWith(false)
    // Act
    const { container } = render(<SignInGoogleButton />)
    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the container the sdk paints its button into', () => {
    facadeWith({})
    identityWith(true)

    const { container } = render(<SignInGoogleButton />)

    expect(container).not.toBeEmptyDOMElement()
  })

  it('sends the credential from google to the sign-in command', () => {
    // Arrange
    facadeWith({})
    identityWith(true)
    render(<SignInGoogleButton />)

    // Act
    const [onCredential] = vi.mocked(useGoogleIdentity).mock.calls[0]
    onCredential(signInGoogleButtonMock.idToken)

    // Assert
    expect(signInWithGoogle).toHaveBeenCalledWith(
      signInGoogleButtonMock.idToken
    )
  })

  it('explains the failure and points to the code path', () => {
    facadeWith({ googleFailed: true })
    identityWith(true)

    render(<SignInGoogleButton />)

    expect(
      screen.getByText(signInGoogleButtonMock.errorMessage)
    ).toBeInTheDocument()
  })
})
