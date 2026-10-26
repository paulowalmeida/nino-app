import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { profile } from '../../mocks/profile-form.mock'
import { useProfileStore } from './profile.state'

vi.mock('@pages/Profile/services/profile/profile.service')

const resetStore = () =>
  useProfileStore.setState({
    profile: null,
    status: 'idle',
    error: null,
    isSaving: false,
    isUpdatingEmail: false,
  })

describe(useProfileStore.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStore()
  })

  it('loads the profile once and keeps it as the source of truth', async () => {
    vi.mocked(ProfileService.getProfile).mockResolvedValue(profile)

    await useProfileStore.getState().load()
    await useProfileStore.getState().load()

    expect(ProfileService.getProfile).toHaveBeenCalledOnce()
    expect(useProfileStore.getState().profile).toEqual(profile)
    expect(useProfileStore.getState().status).toBe('success')
  })

  it('does not issue a second request while loading', async () => {
    useProfileStore.setState({ status: 'loading' })

    await expect(useProfileStore.getState().load()).resolves.toBeNull()

    expect(ProfileService.getProfile).not.toHaveBeenCalled()
  })

  it('stores a loading error without throwing', async () => {
    vi.mocked(ProfileService.getProfile).mockRejectedValue(
      new Error('network error')
    )

    await expect(useProfileStore.getState().load()).resolves.toBeNull()

    expect(useProfileStore.getState()).toMatchObject({
      status: 'error',
      error: 'Não foi possível carregar seu perfil.',
      profile: null,
    })
  })

  it('stores the updated profile after saving', async () => {
    const updated = { ...profile, name: 'Maria Souza' }
    vi.mocked(ProfileService.updateProfile).mockResolvedValue(updated)

    await useProfileStore.getState().save({ name: updated.name })

    expect(useProfileStore.getState().profile).toEqual(updated)
    expect(useProfileStore.getState().isSaving).toBe(false)
  })

  it('resets saving state and rethrows when saving fails', async () => {
    const failure = new Error('network error')
    vi.mocked(ProfileService.updateProfile).mockRejectedValue(failure)

    await expect(
      useProfileStore.getState().save({ name: profile.name })
    ).rejects.toBe(failure)

    expect(useProfileStore.getState()).toMatchObject({
      isSaving: false,
      error: 'O perfil não foi salvo',
    })
  })

  it('updates the first credential after changing the email', async () => {
    const credential = {
      ...profile.credentials[0],
      email: 'nova@example.com',
    }
    vi.mocked(ProfileService.updateMyEmail).mockResolvedValue(credential)
    useProfileStore.setState({
      profile: {
        ...profile,
        credentials: [
          ...profile.credentials,
          { ...profile.credentials[0], email: 'old@example.com' },
        ],
      },
      status: 'success',
    })

    await useProfileStore.getState().updateEmail(credential.email ?? '')

    expect(useProfileStore.getState().profile?.credentials[0]).toEqual(
      credential
    )
    expect(useProfileStore.getState().profile?.credentials[1].email).toBe(
      'old@example.com'
    )
  })

  it('updates an email when no profile is currently stored', async () => {
    const credential = { ...profile.credentials[0], email: 'nova@example.com' }
    vi.mocked(ProfileService.updateMyEmail).mockResolvedValue(credential)

    await useProfileStore.getState().updateEmail(credential.email ?? '')

    expect(useProfileStore.getState().profile).toBeNull()
    expect(useProfileStore.getState().isUpdatingEmail).toBe(false)
  })

  it('resets email updating state and rethrows when changing email fails', async () => {
    const failure = new Error('network error')
    vi.mocked(ProfileService.updateMyEmail).mockRejectedValue(failure)
    useProfileStore.setState({ profile, status: 'success' })

    await expect(
      useProfileStore.getState().updateEmail('nova@example.com')
    ).rejects.toBe(failure)

    expect(useProfileStore.getState().isUpdatingEmail).toBe(false)
  })
})
