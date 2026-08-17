import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CollaboratorAccess,
} from '@organisms/CollaboratorAccess/CollaboratorAccess'
import { useCollaboratorAdmin } from '@hooks/team/useCollaboratorAdmin'

import {
  invitedStaff,
  ownerStaff,
  staffWithLogin,
} from './CollaboratorAccess.mock'

vi.mock('@hooks/team/useCollaboratorAdmin')

type AdminHandle = ReturnType<typeof useCollaboratorAdmin>

const openRemovalConfirm = vi.fn()

const unlockedAdmin: AdminHandle = {
  isEmailModalOpen: false,
  openEmailModal: vi.fn(),
  closeEmailModal: vi.fn(),
  saveEmail: vi.fn(),
  roleLockHint: undefined,
  changeRole: vi.fn(),
  isChangingRole: false,
  removalLockHint: undefined,
  isRemovalConfirmOpen: false,
  openRemovalConfirm,
  closeRemovalConfirm: vi.fn(),
  confirmRemoval: vi.fn(),
  isRemoving: false,
}

const lockedAdmin: AdminHandle = {
  ...unlockedAdmin,
  roleLockHint: 'Só o dono da loja muda o cargo de alguém.',
  removalLockHint: 'A loja precisa de um dono — passe o cargo antes.',
}

const renderAccess = (member = staffWithLogin) =>
  render(
    <MemoryRouter>
      <CollaboratorAccess member={member} />
    </MemoryRouter>
  )

describe(CollaboratorAccess.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCollaboratorAdmin).mockReturnValue(unlockedAdmin)
  })

  it('offers the three ways to administer this person', () => {
    // Arrange / Act
    renderAccess()

    // Assert
    expect(screen.getByText('Até onde vai nesta loja')).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: /Atendente/ })
    ).toBeChecked()
    expect(
      screen.getByRole('button', { name: 'Editar e-mail' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tirar da loja' })
    ).toBeInTheDocument()
  })

  it('opens the removal confirmation instead of removing at once', async () => {
    // Arrange
    renderAccess()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Tirar da loja' }))

    // Assert
    expect(openRemovalConfirm).toHaveBeenCalledOnce()
  })

  it('says why the role and the removal are locked', () => {
    // Arrange
    vi.mocked(useCollaboratorAdmin).mockReturnValue(lockedAdmin)

    // Act
    renderAccess(ownerStaff)

    // Assert
    expect(
      screen.getByText('Só o dono da loja muda o cargo de alguém.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tirar da loja' })).toBeDisabled()
  })

  it('warns that a pending invite still has no access', () => {
    // Arrange / Act
    renderAccess(invitedStaff)

    // Assert
    expect(screen.getByText(/Convite ainda não aceito/)).toBeInTheDocument()
    expect(screen.getByText(/A conta está desativada/)).toBeInTheDocument()
  })
})
