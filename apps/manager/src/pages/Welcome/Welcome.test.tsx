import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Welcome } from './Welcome'
import { welcomePageMock } from './Welcome.mock'

vi.mock('@pages/Welcome/components/BrandTopBar/BrandTopBar', () => ({
  BrandTopBar: () => <div>topo de marca</div>,
}))
vi.mock(
  '@pages/Welcome/components/WelcomeOnboardingContainer/WelcomeOnboardingContainer',
  () => ({ WelcomeOnboardingContainer: () => <div>tour de boas-vindas</div> })
)

describe('Welcome', () => {
  it('composes the top bar and the onboarding tour', () => {
    render(<Welcome />)

    expect(screen.getByText(welcomePageMock.topBarLabel)).toBeInTheDocument()
    expect(
      screen.getByText(welcomePageMock.onboardingLabel)
    ).toBeInTheDocument()
  })
})
