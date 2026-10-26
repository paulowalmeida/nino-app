import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useWelcomeFacade } from '@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade'

import { WelcomeOnboardingContainer } from './WelcomeOnboardingContainer'
import { welcomeOnboardingContainerMock } from './WelcomeOnboardingContainer.mock'

vi.mock('@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade')
vi.mock(
  '@pages/Welcome/adapters/welcomePanelDemo.adapter/welcomePanelDemo.adapter',
  () => ({ welcomePanelDemo: () => <div>demo</div> })
)

const leave = vi.fn()

const renderContainer = () =>
  render(
    <MemoryRouter>
      <WelcomeOnboardingContainer />
    </MemoryRouter>
  )

describe('WelcomeOnboardingContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useWelcomeFacade).mockReturnValue({
      firstName: welcomeOnboardingContainerMock.firstName,
      leave,
    })
  })

  it('greets the owner by name on the first stop', () => {
    renderContainer()

    expect(
      screen.getByText(`Bem-vindo, ${welcomeOnboardingContainerMock.firstName}`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(welcomeOnboardingContainerMock.firstPanelTitle)
    ).toBeInTheDocument()
  })

  it('walks forward through every stop of the tour', async () => {
    renderContainer()

    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.advanceLabel,
      })
    )
    expect(
      screen.getByText(welcomeOnboardingContainerMock.secondPanelTitle)
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.advanceLabel,
      })
    )
    expect(
      screen.getByText(welcomeOnboardingContainerMock.thirdPanelTitle)
    ).toBeInTheDocument()
  })

  it('walks back a stop', async () => {
    renderContainer()

    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.advanceLabel,
      })
    )
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(
      screen.getByText(welcomeOnboardingContainerMock.firstPanelTitle)
    ).toBeInTheDocument()
  })

  it('leaves the tour on the last stop', async () => {
    renderContainer()

    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.advanceLabel,
      })
    )
    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.advanceLabel,
      })
    )
    await userEvent.click(
      screen.getByRole('button', {
        name: welcomeOnboardingContainerMock.finalLabel,
      })
    )

    expect(leave).toHaveBeenCalled()
  })
})
