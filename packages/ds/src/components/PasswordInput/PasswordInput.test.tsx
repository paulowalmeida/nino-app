import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PasswordInput } from './PasswordInput'

describe(PasswordInput.name, () => {
  it('masks the value by default', () => {
    render(<PasswordInput defaultValue="secret" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(document.querySelector('input')).toHaveAttribute('type', 'password')
  })

  it('toggles visibility when the trigger is clicked', async () => {
    render(<PasswordInput defaultValue="secret" />)
    await userEvent.click(screen.getByRole('button'))
    expect(document.querySelector('input')).toHaveAttribute('type', 'text')
  })

  it('calls onChange while typing (register-compatible)', async () => {
    const onChange = vi.fn()
    render(<PasswordInput onChange={onChange} />)
    await userEvent.type(document.querySelector('input')!, 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('forwards the ref to the input', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<PasswordInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('marks the control invalid on error', () => {
    const { container } = render(<PasswordInput error defaultValue="x" />)
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-invalid'
    )
  })

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    const { container } = render(<PasswordInput size={size} />)
    expect(container.querySelector('[data-part="control"]')).toBeInTheDocument()
  })
})
