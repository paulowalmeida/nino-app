import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Soon } from './Soon'
import { soonMock } from './Soon.mock'

describe('Soon', () => {
  it('renders the eyebrow, headline, note, and the "em breve" tag', () => {
    // Arrange
    // Act
    render(<Soon {...soonMock.props} />)

    // Assert
    expect(screen.getByText(soonMock.props.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(soonMock.props.headline)).toBeInTheDocument()
    expect(screen.getByText(soonMock.props.note)).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })
})
