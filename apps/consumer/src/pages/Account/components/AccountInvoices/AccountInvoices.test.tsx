import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountInvoices } from './AccountInvoices'

describe('AccountInvoices', () => {
  it('renders the invoices section headline', () => {
    // Arrange
    // Act
    render(<AccountInvoices />)

    // Assert
    expect(screen.getByText('A nota de cada pedido')).toBeInTheDocument()
  })
})
