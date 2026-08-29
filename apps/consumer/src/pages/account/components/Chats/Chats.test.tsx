import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Chats } from './Chats'

describe('Chats', () => {
  it('renders the chat section headline', () => {
    // Arrange
    // Act
    render(<Chats />)

    // Assert
    expect(screen.getByText('Falar com a loja')).toBeInTheDocument()
  })
})
