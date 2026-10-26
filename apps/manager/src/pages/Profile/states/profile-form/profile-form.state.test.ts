import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { profile } from '../../mocks/profile-form.mock'
import { useProfileStore } from '../profile/profile.state'
import { useProfileFormStore } from './profile-form.state'

vi.mock('@pages/Profile/services/profile/profile.service')

const resetStores = () => {
  useProfileStore.setState({
    profile,
    status: 'success',
    error: null,
    isSaving: false,
    isUpdatingEmail: false,
  })
  useProfileFormStore.setState({
    draft: { name: '', phone: '', email: '' },
    isDirty: false,
    isSaving: false,
    emailError: null,
    saveError: null,
    initializedProfileId: null,
  })
}

describe(useProfileFormStore.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStores()
  })

  it('initializes a draft and marks it dirty when it changes', () => {
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ name: 'Maria Souza' })

    expect(useProfileFormStore.getState().draft).toMatchObject({
      name: 'Maria Souza',
      email: 'maria@example.com',
    })
    expect(useProfileFormStore.getState().isDirty).toBe(true)
  })

  it('blocks an invalid email before calling the service', async () => {
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ email: 'not-an-email' })

    await useProfileFormStore.getState().save()

    expect(useProfileFormStore.getState().emailError).toBe('E-mail inválido')
    expect(ProfileService.updateProfile).not.toHaveBeenCalled()
  })

  it('saves the draft and clears dirty state', async () => {
    vi.mocked(ProfileService.updateProfile).mockResolvedValue({
      ...profile,
      name: 'Maria Souza',
    })
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ name: 'Maria Souza' })

    await useProfileFormStore.getState().save()

    expect(ProfileService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Maria Souza' })
    )
    expect(useProfileFormStore.getState().isDirty).toBe(false)
    expect(useProfileFormStore.getState().saveError).toBeNull()
  })

  it('updates the login email when the draft email changes', async () => {
    vi.mocked(ProfileService.updateProfile).mockResolvedValue(profile)
    vi.mocked(ProfileService.updateMyEmail).mockResolvedValue({
      ...profile.credentials[0],
      email: 'nova@example.com',
    })
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ email: 'nova@example.com' })

    await useProfileFormStore.getState().save()

    expect(ProfileService.updateMyEmail).toHaveBeenCalledWith(
      'nova@example.com'
    )
  })

  it('keeps the draft when the profile save returns no profile', async () => {
    vi.mocked(ProfileService.updateProfile).mockResolvedValue(
      undefined as never
    )
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ name: 'Maria Souza' })

    await useProfileFormStore.getState().save()

    expect(useProfileFormStore.getState().isDirty).toBe(false)
  })

  it('saves a draft when no current profile is available', async () => {
    vi.mocked(ProfileService.updateProfile).mockResolvedValue(profile)
    useProfileStore.setState({ profile: null })
    useProfileFormStore.setState({
      draft: { name: 'Maria Souza', phone: '', email: '' },
      isDirty: true,
    })

    await useProfileFormStore.getState().save()

    expect(ProfileService.updateProfile).toHaveBeenCalledWith({
      name: 'Maria Souza',
      phone: undefined,
    })
  })

  it('keeps an empty optional phone and email draft valid', async () => {
    const profileWithoutContact = {
      ...profile,
      phone: null,
      credentials: [{ ...profile.credentials[0], email: null }],
    }
    useProfileStore.setState({ profile: profileWithoutContact })
    useProfileFormStore.getState().initialize(profileWithoutContact)

    expect(useProfileFormStore.getState().draft).toMatchObject({
      phone: '',
      email: '',
    })
  })

  it('does not reinitialize a dirty or already initialized draft', () => {
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ name: 'Outro nome' })
    useProfileFormStore.getState().initialize({ ...profile, name: 'Nome novo' })

    expect(useProfileFormStore.getState().draft.name).toBe('Outro nome')
  })

  it('keeps the draft dirty and exposes a save error when saving fails', async () => {
    vi.mocked(ProfileService.updateProfile).mockRejectedValue(
      new Error('network error')
    )
    useProfileFormStore.getState().initialize(profile)
    useProfileFormStore.getState().change({ name: 'Maria Souza' })

    await useProfileFormStore.getState().save()

    expect(useProfileFormStore.getState()).toMatchObject({
      isDirty: true,
      isSaving: false,
      saveError: 'Não foi possível salvar. Confira os dados e tente de novo.',
    })
  })
})
