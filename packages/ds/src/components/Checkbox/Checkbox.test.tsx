import { createRef } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'
import styles from './Checkbox.module.css'

describe(Checkbox.name, () => {
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
      styles.boxInvalid
    )
  })

  it('applies default classes when error is false', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('[data-part="control"]')).toHaveClass(
      styles.boxResting
    )
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      render(<Checkbox size={size} />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    }
  )

  it('forwards ref to the input, which is what takes focus', () => {
    // Arrange
    const ref = createRef<HTMLInputElement>()

    // Act
    render(<Checkbox ref={ref} />)

    // Assert
    expect(ref.current).toBe(screen.getByRole('checkbox'))
  })

  it('fires onBlur when focus leaves the control', async () => {
    // Arrange
    const onBlur = vi.fn()
    render(<Checkbox onBlur={onBlur} />)

    // Act
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.tab()

    // Assert
    expect(onBlur).toHaveBeenCalledTimes(1)
  })
})
