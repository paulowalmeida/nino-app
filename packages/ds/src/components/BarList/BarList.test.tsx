import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BarList } from './BarList'

const items = [
  { id: 'a', label: 'X-Burguer', value: 40 },
  { id: 'b', label: 'Batata', value: 10 },
]

describe(BarList.name, () => {
  it('lists every item as a row', () => {
    render(<BarList items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('fills the top bar and scales the rest against it', () => {
    const { container } = render(<BarList items={items} />)
    const bars = container.querySelectorAll('[aria-hidden="true"]')

    expect(bars[0]).toHaveStyle({ width: '100%' })
    expect(bars[1]).toHaveStyle({ width: '25%' })
  })

  it('scales against an explicit ceiling when given', () => {
    const { container } = render(<BarList items={items} max={80} />)
    const bars = container.querySelectorAll('[aria-hidden="true"]')

    expect(bars[0]).toHaveStyle({ width: '50%' })
  })

  it('shows the raw value when no display is given', () => {
    render(<BarList items={items} />)
    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('prefers the formatted display over the raw value', () => {
    render(<BarList items={[{ ...items[0], display: 'R$ 420,00' }]} />)
    expect(screen.getByText('R$ 420,00')).toBeInTheDocument()
    expect(screen.queryByText('40')).not.toBeInTheDocument()
  })

  /* Sem venda no período o ranking não existe — quem chama mostra o vazio. */
  it('renders nothing without items', () => {
    const { container } = render(<BarList items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('survives a zeroed list without dividing by zero', () => {
    const { container } = render(
      <BarList items={[{ id: 'a', label: 'Sem venda', value: 0 }]} />
    )
    expect(container.querySelector('[aria-hidden="true"]')).toHaveStyle({
      width: '0px',
    })
  })
})
