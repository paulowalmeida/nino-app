import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Payment } from './Payment'

describe('Payment', () => {
  it('renders the payment section headline', () => {
    // Arrange
    // Act
    render(<Payment />)

    // Assert
    expect(screen.getByText('Seus cartões salvos')).toBeInTheDocument()
  })
})
