import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DatePicker } from './DatePicker'

describe(DatePicker.name, () => {
  it('renders the date field', () => {
    render(<DatePicker />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays placeholder when no value is set', () => {
    render(<DatePicker placeholder="Escolha uma data" />)
    expect(screen.getByPlaceholderText('Escolha uma data')).toBeInTheDocument()
  })

  it('displays the formatted date when value is provided', () => {
    render(<DatePicker value={new Date(2025, 0, 15)} />)
    expect(screen.getByRole('textbox')).toHaveValue('15/01/2025')
  })

  it('disables the field when disabled=true', () => {
    render(<DatePicker disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('opens the calendar on field click', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('textbox'))
    expect(await screen.findByRole('application')).toBeInTheDocument()
  })

  it('calls onValueChange when selecting a date', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<DatePicker onValueChange={onValueChange} />)
    await user.click(screen.getByRole('textbox'))
    const day15 = screen
      .getAllByRole('button')
      .find((b) => b.textContent === '15')
    await user.click(day15!)
    expect(onValueChange).toHaveBeenCalledWith(expect.any(Date))
  })

  it('closes the calendar after selecting a date', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(<DatePicker />)
    await user.click(screen.getByRole('textbox'))
    const day15 = screen
      .getAllByRole('button')
      .find((b) => b.textContent === '15')
    await user.click(day15!)
    await waitFor(() =>
      expect(screen.queryByRole('application')).not.toBeInTheDocument()
    )
  })
})
