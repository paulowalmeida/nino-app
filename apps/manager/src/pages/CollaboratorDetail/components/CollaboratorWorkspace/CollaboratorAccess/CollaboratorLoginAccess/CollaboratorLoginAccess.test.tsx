import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorLoginAccess } from './CollaboratorLoginAccess'

describe(CollaboratorLoginAccess.name, () => {
  it('presents and edits a login email', async () => {
    const onOpenEmailModal = vi.fn()
    const user = userEvent.setup()
    render(
      <CollaboratorLoginAccess
        email="ana@example.com"
        onOpenEmailModal={onOpenEmailModal}
      />
    )
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Editar e-mail' }))
    expect(onOpenEmailModal).toHaveBeenCalledOnce()
  })

  it('announces when the collaborator has no email', () => {
    render(<CollaboratorLoginAccess email={null} onOpenEmailModal={vi.fn()} />)
    expect(screen.getByText('Nenhum e-mail cadastrado')).toBeInTheDocument()
  })

  it('locks email changes and explains the restriction', () => {
    render(
      <CollaboratorLoginAccess
        email="ana@example.com"
        emailLockHint="Só o dono altera o e-mail."
        onOpenEmailModal={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Editar e-mail' })).toBeDisabled()
    expect(screen.getByText('Só o dono altera o e-mail.')).toBeInTheDocument()
  })
})
