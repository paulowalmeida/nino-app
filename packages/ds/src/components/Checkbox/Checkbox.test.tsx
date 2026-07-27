import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'

describe(Checkbox.displayName!, () => {
  it('renders the checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('starts unchecked by default', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-state',
      'unchecked'
    )
  })

  it('checks on click', async () => {
    const { container } = render(<Checkbox />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-state',
      'checked'
    )
  })

  it('calls onCheckedChange on click', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not call onCheckedChange when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('applies error classes when error is true', () => {
    const { container } = render(<Checkbox error />)
    expect(container.querySelector('[data-part="control"]')).toHaveClass(
      'border-danger'
    )
  })

  it('applies default classes when error is false', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('[data-part="control"]')).toHaveClass(
      'border-input-border'
    )
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      render(<Checkbox size={size} />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    }
  )

  it('forwards ref to the control element', () => {
    const ref = { current: null }
    render(<Checkbox ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
