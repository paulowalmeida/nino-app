import { describe, expect, it } from 'vitest'

import { shortcutLabel } from './shortcut-label'

describe('shortcutLabel', () => {
  it('uses the command key on Apple devices', () => {
    expect(shortcutLabel('B', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)')).toBe(
      '⌘B'
    )
  })

  it('uses Ctrl everywhere else', () => {
    expect(shortcutLabel('B', 'Mozilla/5.0 (X11; Linux x86_64)')).toBe('Ctrl B')
  })
})
