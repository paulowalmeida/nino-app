import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CollaboratorContentContainer } from '@containers/CollaboratorContentContainer/CollaboratorContentContainer'
import { useCollaboratorAdmin } from '@hooks/team/useCollaboratorAdmin'

import { staffWithLogin } from '../../organisms/CollaboratorAccess/CollaboratorAccess.mock'

vi.mock('@hooks/team/useCollaboratorAdmin')

const openEmailModal = vi.fn()
const openRemovalConfirm = vi.fn()

describe(CollaboratorContentContainer.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCollaboratorAdmin).mockReturnValue({
      isEmailModalOpen: false,
      openEmailModal,
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
    })
  })

  it('connects the access tab controls to the scoped administration workflow', async () => {
    render(
      <CollaboratorContentContainer
        member={staffWithLogin}
        activityHeadingLevel={2}
      />
    )

    await userEvent.click(screen.getByRole('tab', { name: 'Acesso' }))
    await userEvent.click(screen.getByRole('button', { name: 'Editar e-mail' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tirar da loja' }))

    expect(useCollaboratorAdmin).toHaveBeenCalledWith(staffWithLogin)
    expect(openEmailModal).toHaveBeenCalledOnce()
    expect(openRemovalConfirm).toHaveBeenCalledOnce()
  })
})
