import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorRoleAccess } from './CollaboratorRoleAccess'

describe(CollaboratorRoleAccess.name, () => {
  it('changes to a valid role', async () => {
    const onChangeRole = vi.fn()
    const user = userEvent.setup()
    render(
      <CollaboratorRoleAccess
        role="STAFF"
        onChangeRole={onChangeRole}
        isChangingRole={false}
      />
    )
    const options = screen.getAllByRole('radio')
    await user.click(options[1])
    expect(onChangeRole).toHaveBeenCalled()
  })

  it('locks role choices while restricted or changing', () => {
    render(
      <CollaboratorRoleAccess
        role="STAFF"
        roleLockHint="Sem permissão"
        onChangeRole={vi.fn()}
        isChangingRole={false}
      />
    )
    expect(screen.getAllByRole('radio')[0]).toBeDisabled()
    expect(screen.getByText('Sem permissão')).toBeInTheDocument()
  })
})
