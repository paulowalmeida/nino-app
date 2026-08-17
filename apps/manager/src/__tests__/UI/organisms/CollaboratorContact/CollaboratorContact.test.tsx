import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CollaboratorContact,
} from '@organisms/CollaboratorContact/CollaboratorContact'

import {
  staffWithLogin,
  staffWithoutContact,
} from './CollaboratorContact.mock'

describe(CollaboratorContact.name, () => {
  it('turns phone and email into links you can act on', () => {
    // Arrange / Act
    render(<CollaboratorContact member={staffWithLogin} />)

    // Assert
    expect(screen.getByRole('link', { name: /98888-7777/ })).toHaveAttribute(
      'href',
      'tel:11988887777'
    )
    expect(
      screen.getByRole('link', { name: /joao@lojateste.com.br/ })
    ).toHaveAttribute('href', 'mailto:joao@lojateste.com.br')
  })

  it('says how this person signs in', () => {
    // Arrange / Act
    render(<CollaboratorContact member={staffWithLogin} />)

    // Assert
    expect(screen.getByText(/Entra com/)).toBeInTheDocument()
  })

  it('drops both links when there is no phone and no email', () => {
    // Arrange / Act
    render(<CollaboratorContact member={staffWithoutContact} />)

    // Assert
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
