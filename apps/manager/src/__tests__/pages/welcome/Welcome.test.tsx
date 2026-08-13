import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@states/useSessionStore'
import { rememberOnboarding } from '@utils/onboarding-seen'

import { Welcome } from '@pages/welcome/Welcome'

import { marina } from './Welcome.mock'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}))
vi.mock('@states/useSessionStore')
vi.mock('@utils/onboarding-seen')

const mockUser = (user: ReturnType<typeof useSessionStore> | null = null) =>
  vi.mocked(useSessionStore).mockImplementation((selector) =>
    selector({ user } as ReturnType<typeof useSessionStore.getState>)
  )

const renderWelcome = () =>
  render(
    <MemoryRouter>
      <Welcome />
    </MemoryRouter>
  )

describe(Welcome.name, () => {
  it('greets the signed-in user by first name on the first panel', () => {
    // Arrange
    mockUser(marina)

    // Act
    renderWelcome()

    // Assert
    expect(screen.getByText('Bem-vindo, Marina')).toBeInTheDocument()
    expect(
      screen.getByText('O pedido cai no balcão')
    ).toBeInTheDocument()
  })

  it('falls back to the panel stage label with no user name', () => {
    // Arrange
    mockUser(null)

    // Act
    renderWelcome()

    // Assert
    expect(screen.getByText('Primeira parada')).toBeInTheDocument()
  })

  it('advances to the next panel and reveals the back button', async () => {
    // Arrange
    mockUser(marina)
    renderWelcome()

    // Act
    await userEvent.click(screen.getByText('Continuar'))

    // Assert
    expect(screen.getByText('A cozinha já sabe')).toBeInTheDocument()
    expect(screen.getByText('Voltar')).toBeInTheDocument()
  })

  it('remembers onboarding and leaves on the last panel', async () => {
    // Arrange
    mockUser(marina)
    renderWelcome()
    await userEvent.click(screen.getByText('Continuar'))
    await userEvent.click(screen.getByText('Continuar'))

    // Act
    await userEvent.click(screen.getByText('Ir para minha loja'))

    // Assert
    expect(rememberOnboarding).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/unidades')
  })

  it('remembers onboarding and leaves when skipping', async () => {
    // Arrange
    mockUser(marina)
    renderWelcome()

    // Act
    await userEvent.click(screen.getByText('Pular'))

    // Assert
    expect(rememberOnboarding).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/unidades')
  })
})
