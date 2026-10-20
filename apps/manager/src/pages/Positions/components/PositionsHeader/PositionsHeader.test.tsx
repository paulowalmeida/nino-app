import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PositionsHeader } from './PositionsHeader'
import { positionsHeaderMock } from './PositionsHeader.mock'

describe(PositionsHeader.name, () => {
  it('titles the screen and explains the owner cargo', () => {
    render(<PositionsHeader />)

    expect(
      screen.getByRole('heading', { name: positionsHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(/O Dono sempre tem/)).toBeInTheDocument()
  })
})
