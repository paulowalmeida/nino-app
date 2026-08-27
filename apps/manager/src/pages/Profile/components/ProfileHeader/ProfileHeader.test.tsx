import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useProfileStore } from '../../states/profile/profile.state'
import { ProfileHeader } from './ProfileHeader'
import {
  googleProfile,
  neverLoggedProfile,
} from './ProfileHeader.mock'

describe(ProfileHeader.name, () => {
  beforeEach(() => {
    useProfileStore.setState({
      profile: null,
      status: 'idle',
      error: null,
      isSaving: false,
      isUpdatingEmail: false,
    })
  })

  it('titles the screen with the name and lists the account facts', () => {
    useProfileStore.setState({ profile: googleProfile, status: 'success' })
    render(<ProfileHeader />)

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
    useProfileStore.setState({
      profile: neverLoggedProfile,
      status: 'success',
    })
    render(<ProfileHeader />)

    expect(screen.getByText('Ainda não entrou por aqui')).toBeInTheDocument()
    expect(screen.getByText('Entra com E-mail e senha')).toBeInTheDocument()
  })

  it('falls back to the provider name when it is not in the catalog', () => {
    useProfileStore.setState({
      profile: {
        ...neverLoggedProfile,
        credentials: [{ ...neverLoggedProfile.credentials[0], provider: 'sso' }],
      },
      status: 'success',
    })
    render(<ProfileHeader />)

    expect(screen.getByText('Entra com sso')).toBeInTheDocument()
  })

  it('falls back to email and password when no provider is available', () => {
    useProfileStore.setState({
      profile: {
        ...neverLoggedProfile,
        credentials: [{ ...neverLoggedProfile.credentials[0], provider: null as never }],
      },
      status: 'success',
    })
    render(<ProfileHeader />)

    expect(screen.getByText('Entra com e-mail e senha')).toBeInTheDocument()
  })

  it('holds the space with skeletons while the profile loads', () => {
    render(<ProfileHeader />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByText(/Entra com/)).not.toBeInTheDocument()
  })
})
