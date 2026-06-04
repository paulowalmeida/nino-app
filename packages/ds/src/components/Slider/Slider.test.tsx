import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Slider } from './Slider'

// jsdom não mede o controle (getBoundingClientRect = 0), então o Ark mantém o
// thumb com visibility:hidden — daí as queries com { hidden: true } e o teclado
// via fireEvent (não dá para focar elemento invisível).
describe(Slider.displayName!, () => {
  it('renders the slider', () => {
    render(<Slider />)
    expect(screen.getByRole('slider', { hidden: true })).toBeInTheDocument()
  })

  it('reflects the current value', () => {
    render(<Slider value={40} />)
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute(
      'aria-valuenow',
      '40'
    )
  })

  it('respects min and max', () => {
    render(<Slider min={10} max={90} value={50} />)
    const thumb = screen.getByRole('slider', { hidden: true })
    expect(thumb).toHaveAttribute('aria-valuemin', '10')
    expect(thumb).toHaveAttribute('aria-valuemax', '90')
  })

  // jsdom não mede o controle → thumb fica visibility:hidden → Ark não processa
  // keyboard events e onValueChange nunca é chamado. Comportamento coberto por e2e.
  it.skip('chama onValueChange ao usar o teclado', () => {
    const onValueChange = vi.fn()
    render(<Slider value={50} onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getByRole('slider', { hidden: true }), {
      key: 'ArrowRight',
    })
    expect(onValueChange).toHaveBeenCalledWith(51)
  })

  it('renders the label when provided', () => {
    render(<Slider label="Preço máximo" />)
    expect(screen.getByText('Preço máximo')).toBeInTheDocument()
  })
})
