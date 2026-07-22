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
})
