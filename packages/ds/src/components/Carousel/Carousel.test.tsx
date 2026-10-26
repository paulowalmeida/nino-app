import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Carousel } from './Carousel'

const slides = [<p key="a">Slide A</p>, <p key="b">Slide B</p>]

describe(Carousel.name, () => {
  it('renders all slides', () => {
    render(<Carousel slides={slides} />)
    expect(screen.getByText('Slide A')).toBeInTheDocument()
    expect(screen.getByText('Slide B')).toBeInTheDocument()
  })

  it('renders one indicator per slide', () => {
    const { container } = render(<Carousel slides={slides} />)
    expect(container.querySelectorAll('[data-part="indicator"]')).toHaveLength(
      2
    )
  })

  it('exposes prev and next triggers', () => {
    render(<Carousel slides={slides} />)
    expect(
      screen.getByRole('button', { name: 'Slide anterior' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Próximo slide' })
    ).toBeInTheDocument()
  })

  it('marks the first indicator as current by default', () => {
    const { container } = render(<Carousel slides={slides} />)
    const indicators = container.querySelectorAll('[data-part="indicator"]')
    expect(indicators[0]).toHaveAttribute('data-current')
    expect(indicators[1]).not.toHaveAttribute('data-current')
  })
})
