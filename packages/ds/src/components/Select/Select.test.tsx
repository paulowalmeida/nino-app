import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'
import styles from './Select.module.css'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe(Select.name, () => {
  it('renders the trigger', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays placeholder when no value is selected', () => {
    render(<Select options={options} placeholder="Selecione..." />)
    expect(screen.getByText('Selecione...')).toBeInTheDocument()
  })

  it('opens the dropdown on trigger click', async () => {
    render(<Select options={options} />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument()
  })

  it('calls onValueChange when selecting an option', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<Select options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox', { hidden: true })
    await user.click(within(listbox).getByRole('option', { name: 'Option A' }))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('does not call onValueChange for a disabled option', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<Select options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox', { hidden: true })
    await user.click(within(listbox).getByRole('option', { name: 'Option C' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('does not open the dropdown when disabled', async () => {
    render(<Select options={options} disabled />)
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('applies error classes when error is true', () => {
    render(<Select options={options} error />)
    expect(screen.getByRole('combobox')).toHaveClass(styles.fieldInvalid)
  })

  it('applies default classes when error is false', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox')).toHaveClass(styles.fieldResting)
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      render(<Select options={options} size={size} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    }
  )

  it('forwards ref to the trigger element', () => {
    const ref = { current: null }
    render(<Select options={options} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
