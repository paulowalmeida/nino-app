import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollaboratorContact } from './CollaboratorContact'

const member = {
  user: {
    phone: '11999999999',
    credentials: [{ provider: 'password', email: 'ana@example.com' }],
  },
}

describe(CollaboratorContact.name, () => {
  it('presents phone, email, and credential provider', () => {
    render(
      <CollaboratorContact
        member={
          {
            ...member,
            user: {
              ...member.user,
              credentials: [{ provider: 'google', email: 'ana@example.com' }],
            },
          } as never
        }
      />
    )
    expect(
      screen.getByRole('link', { name: /\(11\) 99999-9999/ })
    ).toHaveAttribute('href', 'tel:11999999999')
    expect(
      screen.getByRole('link', { name: /ana@example.com/ })
    ).toHaveAttribute('href', 'mailto:ana@example.com')
    expect(screen.getByText(/Entra com/)).toBeInTheDocument()
  })

  it('handles missing phone, email, and provider', () => {
    render(
      <CollaboratorContact
        member={{ user: { phone: null, credentials: [] } } as never}
      />
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Entra com e-mail e senha')).toBeInTheDocument()
  })

  it('falls back to an unknown credential provider name', () => {
    render(
      <CollaboratorContact
        member={
          {
            user: {
              phone: null,
              credentials: [{ provider: 'custom', email: null }],
            },
          } as never
        }
      />
    )
    expect(screen.getByText('Entra com custom')).toBeInTheDocument()
  })
})
