import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountChats } from './AccountChats'

describe('AccountChats', () => {
  it('renders the chat section headline', () => {
    // Arrange
    // Act
    render(<AccountChats />)

    // Assert
    expect(screen.getByText('Falar com a loja')).toBeInTheDocument()
  })
})
