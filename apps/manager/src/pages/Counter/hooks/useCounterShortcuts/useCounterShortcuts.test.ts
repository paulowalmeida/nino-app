import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCounterShortcuts } from './useCounterShortcuts'
import {
  counterShortcutsBlockedMock,
  counterShortcutsMock,
} from './useCounterShortcuts.mock'

describe(useCounterShortcuts.name, () => {
  const onAdvance = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    onAdvance.mockClear()
    onClose.mockClear()
  })

  const press = (key: string, target?: HTMLElement) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true })
    ;(target ?? window).dispatchEvent(event)
  }

  it('advances on Enter and closes on Escape', () => {
    // Arrange
    renderHook(() =>
      useCounterShortcuts({ ...counterShortcutsMock, onAdvance, onClose })
    )

    // Act
    press('Enter')
    press('Escape')

    // Assert
    expect(onAdvance).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignores Enter while the step cannot advance', () => {
    // Arrange
    renderHook(() =>
      useCounterShortcuts({
        ...counterShortcutsBlockedMock,
        onAdvance,
        onClose,
      })
    )

    // Act
    press('Enter')

    // Assert
    expect(onAdvance).not.toHaveBeenCalled()
  })

  it('ignores Enter typed inside a field', () => {
    // Arrange
    renderHook(() =>
      useCounterShortcuts({ ...counterShortcutsMock, onAdvance, onClose })
    )
    const input = document.createElement('input')
    document.body.appendChild(input)

    // Act
    press('Enter', input)

    // Assert
    expect(onAdvance).not.toHaveBeenCalled()
    input.remove()
  })

  it('stays silent while the ticket is closed', () => {
    // Arrange
    renderHook(() =>
      useCounterShortcuts({
        isOpen: false,
        canAdvance: true,
        onAdvance,
        onClose,
      })
    )

    // Act
    press('Enter')
    press('Escape')

    // Assert
    expect(onAdvance).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })
})
