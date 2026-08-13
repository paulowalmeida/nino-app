import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Accordion } from './Accordion'

const items = [
  { value: 'a', trigger: 'Item A', content: 'Conteúdo A' },
  { value: 'b', trigger: 'Item B', content: 'Conteúdo B' },
  { value: 'c', trigger: 'Item C', content: 'Conteúdo C', disabled: true },
]

describe(Accordion.name, () => {
  it('renders the triggers', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('opens an item on trigger click', async () => {
    render(<Accordion items={items} defaultValue={['a']} />)
    expect(screen.getByText('Conteúdo A')).toBeInTheDocument()
  })

  it('calls onValueChange when opening an item', async () => {
    const onValueChange = vi.fn()
    render(<Accordion items={items} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByText('Item A'))
    expect(onValueChange).toHaveBeenCalledWith(['a'])
  })

  it('disables the item marked as disabled', () => {
    render(<Accordion items={items} />)
    const trigger = screen.getByText('Item C').closest('button')
    expect(trigger).toBeDisabled()
  })

  it('opens multiple items when multiple=true', async () => {
    render(<Accordion items={items} multiple defaultValue={['a', 'b']} />)
    expect(screen.getByText('Conteúdo A')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo B')).toBeInTheDocument()
  })

  it('applies itemClassName and triggerClassName to every item', () => {
    render(
      <Accordion
        items={items}
        itemClassName="bg-transparent"
        triggerClassName="text-fg-on-brand/80"
      />
    )
    const trigger = screen.getByText('Item A').closest('button')
    expect(trigger).toHaveClass('text-fg-on-brand/80')
    expect(trigger?.closest('[data-part="item"]')).toHaveClass('bg-transparent')
  })
})
