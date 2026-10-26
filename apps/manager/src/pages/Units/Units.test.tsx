import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Units } from './Units'

vi.mock('./components/UnitsHeader/UnitsHeader', () => ({
  UnitsHeader: () => <div>Units header</div>,
}))
vi.mock('./components/UnitsSetup/UnitsSetup', () => ({
  UnitsSetup: () => <div>Units setup</div>,
}))
vi.mock('./components/UnitsTopBar/UnitsTopBar', () => ({
  UnitsTopBar: () => <div>Units top bar</div>,
}))

describe(Units.name, () => {
  it('delegates the screen to the domain workspace', () => {
    render(<Units />)
    expect(screen.getByText('Units top bar')).toBeInTheDocument()
    expect(screen.getByText('Units header')).toBeInTheDocument()
    expect(screen.getByText('Units setup')).toBeInTheDocument()
  })
})
