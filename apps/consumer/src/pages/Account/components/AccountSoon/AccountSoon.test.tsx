import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountSoon } from './AccountSoon'
import { accountSoonMock } from './AccountSoon.mock'

describe('AccountSoon', () => {
  it('renders the eyebrow, headline, note, and the "em breve" tag', () => {
    // Arrange
    // Act
    render(<AccountSoon {...accountSoonMock.props} />)

    // Assert
    expect(screen.getByText(accountSoonMock.props.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(accountSoonMock.props.headline)).toBeInTheDocument()
    expect(screen.getByText(accountSoonMock.props.note)).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })
})
