import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CashShortcuts } from './CashShortcuts'
import { cashShortcutsMock } from './CashShortcuts.mock'

describe(CashShortcuts.name, () => {
  it('offers the exact payment and every suggested note', () => {
    render(<CashShortcuts {...cashShortcutsMock} onSelect={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Valor exato' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /50,00/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /200,00/ })).toBeInTheDocument()
  })

  it('clears the received amount when the payment is exact', async () => {
    // Arrange
    const onSelect = vi.fn()
    render(<CashShortcuts {...cashShortcutsMock} onSelect={onSelect} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Valor exato' }))

    // Assert
    expect(onSelect).toHaveBeenCalledWith('')
  })

  it('fills the field with the note the attendant took', async () => {
    // Arrange
    const onSelect = vi.fn()
    render(<CashShortcuts {...cashShortcutsMock} onSelect={onSelect} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: /100,00/ }))

    // Assert
    expect(onSelect).toHaveBeenCalledWith('100,00')
  })

  it('marks the exact payment while no amount was received', () => {
    render(<CashShortcuts {...cashShortcutsMock} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Valor exato' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('releases the exact payment once an amount is typed', () => {
    render(
      <CashShortcuts {...cashShortcutsMock} hasChange onSelect={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: 'Valor exato' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('shows only the exact payment when no note covers the sale', () => {
    render(
      <CashShortcuts {...cashShortcutsMock} notes={[]} onSelect={vi.fn()} />
    )

    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
