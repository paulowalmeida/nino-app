import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Positions } from './Positions'
import { positionsPageMock } from './Positions.mock'

vi.mock('./components/PositionsHeader/PositionsHeader', () => ({
  PositionsHeader: () => <h1>{positionsPageMock.title}</h1>,
}))
vi.mock('./components/PositionsContent/PositionsContent', () => ({
  PositionsContent: () => <div>content</div>,
}))

describe(Positions.name, () => {
  it('composes the header and the cargo list', () => {
    render(<Positions />)

    expect(
      screen.getByRole('heading', { name: positionsPageMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
