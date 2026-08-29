import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountSkeleton } from './AccountSkeleton'

describe('AccountSkeleton', () => {
  it('renders a busy loading region for the account screen', () => {
    // Arrange
    // Act
    render(<AccountSkeleton />)

    // Assert
    expect(screen.getByLabelText('Carregando a conta')).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })
})
