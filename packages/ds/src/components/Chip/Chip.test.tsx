import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Chip } from './Chip'
import styles from './Chip.module.css'

describe(Chip.name, () => {
  it('renders the content', () => {
    render(
      <Chip variant="toggle" selected={false}>
        Pix
      </Chip>
    )
    expect(screen.getByText('Pix')).toBeInTheDocument()
  })

  it('is borderless by default and supports an outlined opt-in', () => {
    const { rerender } = render(
      <Chip variant="toggle" selected={false}>
        Pix
      </Chip>
    )
    expect(screen.getByRole('button')).toHaveClass(styles.borderless)

    rerender(
      <Chip variant="toggle" selected={false} borderless={false}>
        Pix
      </Chip>
    )
    expect(screen.getByRole('button')).toHaveClass(styles.outlined)
  })

  it('renders optional content on either side of the label', () => {
    render(
      <Chip
        variant="toggle"
        selected={false}
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
      >
        Pix
      </Chip>
    )

    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('exposes aria-selected, not aria-pressed, when variant is tab', () => {
    render(
      <Chip variant="tab" selected>
        Categoria
      </Chip>
    )
    const chip = screen.getByRole('tab')
    expect(chip).toHaveAttribute('aria-selected', 'true')
    expect(chip).not.toHaveAttribute('aria-pressed')
  })

  it('exposes aria-pressed, not aria-selected, when variant is toggle', () => {
    render(
      <Chip variant="toggle" selected>
        Pix
      </Chip>
    )
    const chip = screen.getByRole('button')
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(chip).not.toHaveAttribute('aria-selected')
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Chip variant="toggle" selected={false} onClick={onClick}>
        Pix
      </Chip>
    )

    await user.click(screen.getByText('Pix'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
