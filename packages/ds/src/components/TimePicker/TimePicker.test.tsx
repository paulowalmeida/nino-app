import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TimePicker } from './TimePicker'

describe(TimePicker.name, () => {
  it('renders the input', () => {
    render(<TimePicker />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays the default placeholder', () => {
    render(<TimePicker />)
    expect(screen.getByPlaceholderText('--:--')).toBeInTheDocument()
  })

  it('builds a 15-minute grid by default', async () => {
    render(<TimePicker />)
    await userEvent.type(screen.getByRole('combobox'), '08')
    expect(
      screen.getByRole('option', { name: '08:15', hidden: true })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: '09:00', hidden: true })
    ).not.toBeInTheDocument()
  })

  it('respects a custom step', async () => {
    render(<TimePicker step={30} />)
    await userEvent.type(screen.getByRole('combobox'), '08')
    expect(
      screen.getByRole('option', { name: '08:00', hidden: true })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: '08:30', hidden: true })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: '08:15', hidden: true })
    ).not.toBeInTheDocument()
  })

  it('calls onValueChange when selecting a time', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<TimePicker onValueChange={onValueChange} />)
    await userEvent.type(screen.getByRole('combobox'), '00')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('00:00')
  })

  it('applies error state when error is true', () => {
    render(<TimePicker error />)
    expect(screen.getByRole('combobox')).toHaveAttribute('data-invalid')
  })

  it('strips letters and stray symbols while typing', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), 'a1b:c2!!!zz')
    expect(screen.getByRole('combobox')).toHaveValue('1:2')
  })

  it('caps the typed search at 4 digits, not a 5th raw digit', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '0123456789')
    expect(screen.getByRole('combobox')).toHaveValue('0123')
  })

  it('accepts a single colon among the 4 digits', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '01:2345')
    expect(screen.getByRole('combobox')).toHaveValue('01:23')
  })

  it('rejects a second colon', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '01::23')
    expect(screen.getByRole('combobox')).toHaveValue('01:23')
  })
})
