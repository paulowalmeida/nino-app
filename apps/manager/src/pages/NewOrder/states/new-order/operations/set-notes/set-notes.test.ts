import { describe, expect, it, vi } from 'vitest'

import { setNotes } from './set-notes'
import { notesMock } from './set-notes.mock'

describe('setNotes', () => {
  it('writes what the kitchen has to know', () => {
    const set = vi.fn()

    setNotes(set, notesMock)

    expect(set).toHaveBeenCalledWith({ notes: notesMock })
  })
})
