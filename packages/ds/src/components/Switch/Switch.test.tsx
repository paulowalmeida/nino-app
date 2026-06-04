import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './Switch'

describe(Switch.name, () => {
  it('renders unchecked by default', () => {
    const { container } = render(<Switch aria-label="toggle" />)
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-state',
      'unchecked'
    )
  })

  it('renders checked when defaultChecked is set', () => {
    const { container } = render(<Switch aria-label="toggle" defaultChecked />)
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-state',
      'checked'
    )
  })

  it('calls onCheckedChange on click', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="toggle" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not fire events when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(
      <Switch aria-label="toggle" disabled onCheckedChange={onCheckedChange} />
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it.each(['sm', 'md'] as const)('renderiza tamanho %s sem erros', (size) => {
    const { container } = render(<Switch aria-label="toggle" size={size} />)
    expect(container.querySelector('[data-part="control"]')).toBeInTheDocument()
  })
})
