import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TimingFiguresGrid } from './TimingFiguresGrid'

describe('TimingFiguresGrid', () => {
  it('renders pending timing figures', () => {
    const { container } = render(<TimingFiguresGrid timing={undefined} isPending />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
