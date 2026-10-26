import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TimePicker } from './TimePicker'

/* Digitar tecla a tecla com `delay` real fica lento quando a máquina roda
 * vários pacotes ao mesmo tempo; o padrão de 1s do waitFor não cobre isso. */
const WAIT = 5000

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
      await screen.findByRole('option', { name: '08:15', hidden: true })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.queryByRole('option', { name: '09:00', hidden: true })
      ).not.toBeInTheDocument()
    )
  })

  it('respects a custom step', async () => {
    render(<TimePicker step={30} />)
    await userEvent.type(screen.getByRole('combobox'), '08')
    expect(
      await screen.findByRole('option', { name: '08:00', hidden: true })
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('option', { name: '08:30', hidden: true })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.queryByRole('option', { name: '08:15', hidden: true })
      ).not.toBeInTheDocument()
    )
  })

  it('calls onValueChange when selecting a time', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onValueChange = vi.fn()
    render(<TimePicker onValueChange={onValueChange} />)
    await userEvent.type(screen.getByRole('combobox'), '00')
    await user.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('00:00'), {
      timeout: WAIT,
    })
  })

  it('applies error state when error is true', () => {
    render(<TimePicker error />)
    expect(screen.getByRole('combobox')).toHaveAttribute('data-invalid')
  })

  it('strips letters and stray symbols while typing', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), 'a1b:c2!!!zz')
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('12'))
  })

  it('masks the typed digits as HH:mm automatically', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '1430')
    await waitFor(() =>
      expect(screen.getByRole('combobox')).toHaveValue('14:30')
    )
  })

  it('caps the typed search at 4 digits, not a 5th raw digit', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '0123456789')
    await waitFor(() =>
      expect(screen.getByRole('combobox')).toHaveValue('01:23')
    )
  })

  it('accepts a single colon among the 4 digits', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '01:2345')
    await waitFor(() =>
      expect(screen.getByRole('combobox')).toHaveValue('01:23')
    )
  })

  it('rejects a second colon', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    await user.type(screen.getByRole('combobox'), '01::23')
    await waitFor(() =>
      expect(screen.getByRole('combobox')).toHaveValue('01:23')
    )
  })

  it('replaces a pre-filled value when typing starts over it', async () => {
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker value="00:00" />)
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('1430')
    await waitFor(() => expect(input).toHaveValue('14:30'), { timeout: WAIT })
  })

  it('commits a full typed time on blur, no option click', async () => {
    // Arrange
    const user = userEvent.setup({ delay: 5 })
    const onValueChange = vi.fn()
    render(<TimePicker value="07:00" onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox')

    // Act
    await user.click(input)
    await user.keyboard('0000')
    await user.tab()

    // Assert
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('00:00'), {
      timeout: WAIT,
    })
  })

  it('reverts an incomplete typed time on blur', async () => {
    // Arrange
    const user = userEvent.setup({ delay: 5 })
    const onValueChange = vi.fn()
    render(<TimePicker value="07:00" onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox')

    // Act
    await user.click(input)
    await user.keyboard('08')
    await user.tab()

    // Assert
    await waitFor(() => expect(input).toHaveValue('07:00'), { timeout: WAIT })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('trims a pasted run of digits down to HH:mm', async () => {
    // Arrange
    const user = userEvent.setup({ delay: 5 })
    render(<TimePicker />)
    const input = screen.getByRole('combobox')

    // Act
    await user.click(input)
    await user.paste('1430999')

    // Assert
    await waitFor(() => expect(input).toHaveValue('14:30'), { timeout: WAIT })
  })
})
