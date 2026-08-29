import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Invoices } from './Invoices'

describe('Invoices', () => {
  it('renders the invoices section headline', () => {
    // Arrange
    // Act
    render(<Invoices />)

    // Assert
    expect(screen.getByText('A nota de cada pedido')).toBeInTheDocument()
  })
})
