import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button'
import { Menu } from './Menu'

function items(onSelect = vi.fn()) {
  return [
    { value: 'edit', label: 'Editar', onSelect },
    { separator: true as const },
    { value: 'del', label: 'Excluir', destructive: true, onSelect },
    { value: 'lock', label: 'Bloquear', disabled: true, onSelect },
  ]
}

describe(Menu.displayName!, () => {
  it('renders the trigger', () => {
    render(<Menu trigger={<Button>Ações</Button>} items={items()} />)
    expect(screen.getByRole('button', { name: 'Ações' })).toBeInTheDocument()
  })

  it('opens and displays items on trigger click', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<Menu trigger={<Button>Ações</Button>} items={items()} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    expect(
      await screen.findByRole('menuitem', { name: 'Editar' })
    ).toBeInTheDocument()
  })

  it('calls onSelect for the clicked item', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onSelect = vi.fn()
    render(<Menu trigger={<Button>Ações</Button>} items={items(onSelect)} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Editar' }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('disabled item does not fire onSelect', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onSelect = vi.fn()
    render(<Menu trigger={<Button>Ações</Button>} items={items(onSelect)} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Bloquear' }))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
