import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountBadge } from '@organisms/AccountBadge/AccountBadge'

import { googleProfile, neverLoggedProfile } from './AccountBadge.mock'

describe(AccountBadge.name, () => {
  it('titles the screen with the name and lists the account facts', () => {
    // Arrange / Act
    render(<AccountBadge profile={googleProfile} />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Marina Prado' })
    ).toBeInTheDocument()
    expect(screen.getByText('Entra com Google')).toBeInTheDocument()
    expect(
      screen.getByText('No nino desde 12 de março de 2026')
    ).toBeInTheDocument()
    expect(screen.getByText(/Último acesso/)).toBeInTheDocument()
  })

  it('says the person never signed in instead of showing a dash', () => {
    // Arrange / Act
    render(<AccountBadge profile={neverLoggedProfile} />)

    // Assert
    expect(screen.getByText('Ainda não entrou por aqui')).toBeInTheDocument()
    expect(screen.getByText('Entra com E-mail e senha')).toBeInTheDocument()
  })

  it('holds the space with skeletons while the profile loads', () => {
    // Arrange / Act
    render(<AccountBadge profile={undefined} />)

    // Assert
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByText(/Entra com/)).not.toBeInTheDocument()
  })
})
