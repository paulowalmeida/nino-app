import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InviteForm } from './InviteForm'

describe(InviteForm.name, () => {
  it('presents the invitation fields and submit action', () => {
    render(<InviteForm onInvite={async () => undefined} />)
    expect(
      screen.getByPlaceholderText('nome@exemplo.com')
    ).toBeInTheDocument()
    expect(screen.getByText('Enviar convite')).toBeInTheDocument()
  })
})
