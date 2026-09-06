import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignIn } from './SignIn'
import { signInMock } from './SignIn.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    home: '/',
    store: undefined,
    step: 'method',
    channel: 'phone',
    setChannel: vi.fn(),
    phone: '',
    setPhone: vi.fn(),
    email: '',
    setEmail: vi.fn(),
    code: '',
    setCode: vi.fn(),
    requestCode: vi.fn(),
    isRequesting: false,
    requestFailed: false,
    verifyCode: vi.fn(),
    isVerifying: false,
    verifyFailed: false,
    goToIdentify: vi.fn(),
    goToMethods: vi.fn(),
    setGoogleDraft: vi.fn(),
    googleDraft: null,
    googleFailed: false,
    reset: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignIn', () => {
  it('renders the method choice first', () => {
    facadeWith({ step: 'method' })

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )

    expect(screen.getByText(signInMock.identifyTitle)).toBeInTheDocument()
    expect(screen.queryByText('Digite o código')).not.toBeInTheDocument()
  })

  it('renders the code step once it is reached', () => {
    facadeWith({ step: 'code' })

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )

    expect(screen.getByText('Digite o código')).toBeInTheDocument()
    expect(screen.queryByText(signInMock.identifyTitle)).not.toBeInTheDocument()
  })

  it('tints the shell with the store color once the store loads', () => {
    facadeWith({ store: signInMock.store })

    const { container } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )

    expect(container.firstChild).toHaveStyle({
      '--store-tint': signInMock.store.primaryColor,
    })
  })
})
