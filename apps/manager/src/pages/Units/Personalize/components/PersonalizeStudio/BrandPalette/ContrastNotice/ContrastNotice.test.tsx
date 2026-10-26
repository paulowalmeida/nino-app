import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ContrastNotice } from './ContrastNotice'
import { illegibleColorsMock, legibleColorsMock } from './ContrastNotice.mock'

describe(ContrastNotice.name, () => {
  it('stays silent while every pair is readable', () => {
    const { container } = render(<ContrastNotice colors={legibleColorsMock} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('names the unreadable pair and the ratio it reached', () => {
    render(<ContrastNotice colors={illegibleColorsMock} />)

    expect(screen.getByText('Texto sobre o fundo')).toBeInTheDocument()
    expect(screen.getAllByText(/mínimo 4.5:1/).length).toBeGreaterThan(0)
  })
})
