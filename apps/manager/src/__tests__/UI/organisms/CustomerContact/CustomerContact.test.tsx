import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerContact } from '@organisms/CustomerContact/CustomerContact'

import { customerHistory } from './CustomerContact.mock'

describe(CustomerContact.name, () => {
  it('turns phone and e-mail into links that place the contact', () => {
    // Arrange / Act
    render(<CustomerContact customer={customerHistory} />)

    // Assert
    expect(screen.getByRole('link', { name: /99999-0000/ })).toHaveAttribute(
      'href',
      'tel:11999990000'
    )
    expect(screen.getByRole('link', { name: /ana@example/ })).toHaveAttribute(
      'href',
      'mailto:ana@example.com'
    )
  })

  it('shows the masked cpf alongside the contact actions', () => {
    // Arrange / Act
    render(<CustomerContact customer={customerHistory} />)

    // Assert
    expect(screen.getByText('CPF 123.456.789-00')).toBeInTheDocument()
  })

  it('drops e-mail and cpf when the customer has neither', () => {
    // Arrange
    const customer = { ...customerHistory, email: null, cpf: null }

    // Act
    render(<CustomerContact customer={customer} />)

    // Assert
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.queryByText(/CPF/)).not.toBeInTheDocument()
  })
})
