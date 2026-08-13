import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ColorPicker } from './ColorPicker'
import { COLOR_PALETTE } from './ColorPicker.palette'

const NINO_ORANGE = '#FF6B00'
const [orange, amber] = COLOR_PALETTE
const shadeTriggers = () =>
  document.querySelectorAll('[data-part="swatch-trigger"]')

describe(ColorPicker.name, () => {
  it('offers one hue per family, and the full scale of the open one', () => {
    // Arrange / Act
    render(<ColorPicker value={orange.tints[5]} />)

    // Assert
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(
      COLOR_PALETTE.length - 1
    )
    expect(shadeTriggers()).toHaveLength(orange.tints.length)
  })

  it('opens on the family that owns the current color', () => {
    // Arrange / Act
    render(<ColorPicker value={amber.tints[2]} />)

    // Assert
    expect(screen.getByRole('button', { name: amber.name })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('emits the hex of the shade that was clicked', async () => {
    // Arrange
    const onValueChange = vi.fn()
    render(<ColorPicker value={orange.tints[5]} onValueChange={onValueChange} />)

    // Act
    await userEvent.click(
      screen.getByLabelText(`${orange.name} ${orange.tints[9]}`)
    )

    // Assert
    expect(onValueChange).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${orange.tints[9]}$`, 'i'))
    )
  })

  it('keeps the shade when the hue changes', async () => {
    // Arrange
    const onValueChange = vi.fn()
    render(<ColorPicker value={orange.tints[9]} onValueChange={onValueChange} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: amber.name }))

    // Assert
    expect(onValueChange).toHaveBeenCalledWith(amber.tints[9])
  })

  it('falls back to the mid shade for a color outside the catalog', async () => {
    // Arrange
    const onValueChange = vi.fn()
    render(<ColorPicker value="#123456" onValueChange={onValueChange} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: amber.name }))

    // Assert
    expect(onValueChange).toHaveBeenCalledWith(amber.tints[5])
  })

  it('does not emit while disabled', async () => {
    // Arrange
    const onValueChange = vi.fn()
    render(
      <ColorPicker value={NINO_ORANGE} disabled onValueChange={onValueChange} />
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: amber.name }))

    // Assert
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('names the picker for assistive tech', () => {
    // Arrange / Act
    render(<ColorPicker value={NINO_ORANGE} label="Cor da marca" />)

    // Assert
    expect(screen.getByLabelText('Cor da marca')).toBeInTheDocument()
  })
})
