import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './Spinner'

describe(Spinner.name, () => {
  it('renders when visible is true', () => {
    render(<Spinner visible />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render when visible is false', () => {
    render(<Spinner visible={false} />)
    expect(document.querySelector('svg')).not.toBeInTheDocument()
  })

  it('applies the given size', () => {
    render(<Spinner visible size={24} />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })
})
