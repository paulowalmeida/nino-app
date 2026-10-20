import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorRoleAccess } from './CollaboratorRoleAccess'
import { collaboratorRoleAccessMock } from './CollaboratorRoleAccess.mock'

describe(CollaboratorRoleAccess.name, () => {
  it('titles the choice as the collaborator role', () => {
    render(
      <CollaboratorRoleAccess
        role={collaboratorRoleAccessMock.role}
        onChangeRole={vi.fn()}
        isChangingRole={false}
      />
    )

    expect(screen.getByRole('heading', { name: 'Cargo' })).toBeInTheDocument()
  })

  it('offers only the roles a promotion can reach, never owner', () => {
    render(
      <CollaboratorRoleAccess
        role={collaboratorRoleAccessMock.role}
        onChangeRole={vi.fn()}
        isChangingRole={false}
      />
    )

    collaboratorRoleAccessMock.roleLabels.forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    )
    expect(
      screen.queryByText(collaboratorRoleAccessMock.hiddenRoleLabel)
    ).not.toBeInTheDocument()
  })

  it('promotes to manager', async () => {
    const onChangeRole = vi.fn()
    render(
      <CollaboratorRoleAccess
        role={collaboratorRoleAccessMock.role}
        onChangeRole={onChangeRole}
        isChangingRole={false}
      />
    )

    await userEvent.click(screen.getByLabelText(/Gerente/))

    expect(onChangeRole).toHaveBeenCalledWith('MANAGER')
  })

  it('locks the choice while the change is saved', () => {
    render(
      <CollaboratorRoleAccess
        role={collaboratorRoleAccessMock.role}
        onChangeRole={vi.fn()}
        isChangingRole
      />
    )

    screen
      .getAllByRole('radio')
      .forEach((option) => expect(option).toBeDisabled())
  })
})
