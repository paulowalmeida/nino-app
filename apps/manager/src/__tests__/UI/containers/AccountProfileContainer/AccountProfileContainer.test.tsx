import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Profile } from '@custom_types/account/profile'
import { useAccountForm } from '@hooks/account/useAccountForm'
import {
  AccountProfileContainer,
} from '../../../../UI/containers/AccountProfileContainer/AccountProfileContainer'

vi.mock('@hooks/account/useAccountForm')

const profile: Profile = {
  id: 'profile-1',
  name: 'Maria Silva',
  phone: '+5585999998888',
  locale: 'pt-BR',
  timezone: 'America/Fortaleza',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: null,
  credentials: [
    {
      id: 'credential-1',
      userId: 'profile-1',
      email: 'maria@example.com',
      provider: 'password',
      providerCode: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}

describe(AccountProfileContainer.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('connects profile editing behavior to the form', async () => {
    const change = vi.fn()
    const handleSave = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useAccountForm).mockReturnValue({
      draft: { name: 'Maria Silva', email: 'maria@example.com', phone: '(85) 99999-8888' },
      isDirty: true,
      isSaving: false,
      emailError: null,
      saveError: null,
      change,
      handleSave,
    })
    const user = userEvent.setup()

    render(<AccountProfileContainer profile={profile} />)

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Maria Souza' },
    })
    await user.click(screen.getByRole('button', { name: 'Salvar meus dados' }))

    expect(useAccountForm).toHaveBeenCalledWith(profile)
    expect(change).toHaveBeenLastCalledWith({ name: 'Maria Souza' })
    expect(handleSave).toHaveBeenCalledOnce()
  })
})
