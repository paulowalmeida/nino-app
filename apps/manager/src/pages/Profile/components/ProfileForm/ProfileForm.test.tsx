import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { profile } from '../../mocks/profile-form.mock'
import { useProfileStore } from '../../states/profile/profile.state'
import { useProfileFormStore } from '../../states/profile-form/profile-form.state'
import { ProfileForm } from './ProfileForm'

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
    draft: {
      name: profile.name,
      phone: '(85) 99999-8888',
      email: 'maria@example.com',
    },
    isDirty: false,
    isSaving: false,
    emailError: null,
    saveError: null,
    initializedProfileId: profile.id,
  })
}

describe(ProfileForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStores()
  })

  it('renders the store draft and keeps saving disabled when unchanged', () => {
    render(<ProfileForm />)

    expect(screen.getByLabelText('Nome')).toHaveValue('Maria Silva')
    expect(screen.getByLabelText('E-mail')).toHaveValue('maria@example.com')
    expect(screen.getByLabelText('Telefone')).toHaveValue('(85) 99999-8888')
    expect(screen.getByText('Nada mudou ainda.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Salvar meus dados' })
    ).toBeDisabled()
  })

  it('updates the store from fields and saves the dirty draft', async () => {
    const user = userEvent.setup()
    vi.mocked(ProfileService.updateProfile).mockResolvedValue({
      ...profile,
      name: 'Maria Souza',
    })

    render(<ProfileForm />)
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Maria Souza' },
    })
    fireEvent.change(screen.getByPlaceholderText('nome@exemplo.com'), {
      target: { value: 'nova@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Telefone'), {
      target: { value: '(85) 98888-7777' },
    })
    await user.click(screen.getByRole('button', { name: 'Salvar meus dados' }))

    expect(ProfileService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Maria Souza' })
    )
    expect(useProfileFormStore.getState().isDirty).toBe(false)
  })

  it('shows errors and saving state from the store', () => {
    useProfileFormStore.setState({
      isDirty: true,
      isSaving: true,
      emailError: 'E-mail inválido',
      saveError: 'Não foi possível salvar.',
    })

    render(<ProfileForm />)

    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível salvar.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carregando' })).toBeDisabled()
  })
})
