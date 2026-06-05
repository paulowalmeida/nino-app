import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ColorPicker } from './ColorPicker'

const trigger = (c: HTMLElement) =>
  c.querySelector('[data-part="trigger"]') as Element

describe(ColorPicker.name, () => {
  it('renders the control trigger', () => {
    const { container } = render(<ColorPicker defaultValue="#FF6B00" />)
    expect(container.querySelector('[data-part="control"]')).toBeInTheDocument()
    expect(trigger(container)).toBeTruthy()
  })

  it('opens the picker content on trigger click', async () => {
    const { container } = render(<ColorPicker defaultValue="#FF6B00" />)
    await userEvent.click(trigger(container))
    expect(container.querySelector('[data-part="control"]')).toHaveAttribute(
      'data-state',
      'open'
    )
  })

  it('emits a hex string when a preset is chosen', async () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <ColorPicker
        defaultValue="#FF6B00"
        presets={['#2563EB']}
        onValueChange={onValueChange}
      />
    )
    await userEvent.click(trigger(container))
    const swatch = document.querySelector('[data-part="swatch-trigger"]')
    await userEvent.click(swatch as Element)
    expect(onValueChange).toHaveBeenCalledWith(
      expect.stringMatching(/^#2563eb$/i)
    )
  })
})
