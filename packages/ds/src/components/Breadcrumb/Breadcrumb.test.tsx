import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Breadcrumb } from './Breadcrumb'

const items = [
  { label: 'Início', href: '/' },
  { label: 'Pedidos', href: '/pedidos' },
  { label: 'Detalhes' },
]

describe(Breadcrumb.displayName!, () => {
  it('renders all items', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Detalhes')).toBeInTheDocument()
  })

  it('marks the last item with aria-current=page', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByText('Detalhes').closest('a')).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('intermediate items do not have aria-current', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByText('Início').closest('a')).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('calls onClick when clicking an item with handler', async () => {
    const onClick = vi.fn((e) => e.preventDefault())
    render(<Breadcrumb items={[{ label: 'Home', href: '/', onClick }]} />)
    screen.getByText('Home').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders custom separator', () => {
    render(<Breadcrumb items={items} separator="/" />)
    expect(screen.getAllByText('/')).toHaveLength(items.length - 1)
  })
})
