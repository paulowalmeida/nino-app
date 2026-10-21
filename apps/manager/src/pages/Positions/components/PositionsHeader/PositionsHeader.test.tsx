import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PositionsHeader } from './PositionsHeader'
import { positionsHeaderMock } from './PositionsHeader.mock'

describe(PositionsHeader.name, () => {
  it('titles the screen, explains the owner cargo and links a new one', () => {
    render(
      <MemoryRouter>
        <PositionsHeader />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: positionsHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(/O Dono sempre tem/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Novo cargo/ })).toHaveAttribute(
      'href',
      '/novo'
    )
  })
})
