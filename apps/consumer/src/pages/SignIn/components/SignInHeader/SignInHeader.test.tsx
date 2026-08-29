import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import {
  useSignInFacade,
} from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import { SignInHeader } from './SignInHeader'
import { signInHeaderMock } from './SignInHeader.mock'

vi.mock('@pages/sign-in/facades/useSignInFacade/useSignInFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSignInFacade).mockReturnValue({
    home: signInHeaderMock.home,
    store: undefined,
    ...overrides,
  } as unknown as ReturnType<typeof useSignInFacade>)

describe('SignInHeader', () => {
  it('links back to the store even before it loads', () => {
    facadeWith({})

    render(
      <MemoryRouter>
        <SignInHeader />
      </MemoryRouter>
    )

    const backLink = screen.getByRole('link', { name: 'Voltar para a loja' })
    expect(backLink).toHaveAttribute('href', signInHeaderMock.home)
  })

  it('shows the store name and logo once the store loads', () => {
    facadeWith({ store: signInHeaderMock.storeWithLogo })

    render(
      <MemoryRouter>
        <SignInHeader />
      </MemoryRouter>
    )

    expect(
      screen.getByText(signInHeaderMock.storeWithLogo.customName)
    ).toBeInTheDocument()
    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      signInHeaderMock.storeWithLogo.logoUrl
    )
  })

  it('falls back to initials when the store has no logo', () => {
    facadeWith({ store: signInHeaderMock.storeWithoutLogo })

    render(
      <MemoryRouter>
        <SignInHeader />
      </MemoryRouter>
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
