import { describe, expect, it } from 'vitest'

import { payableNotes } from './payableNotes'
import { payableNotesCasesMock } from './payableNotes.mock'

describe(payableNotes.name, () => {
  it('offers only the notes that cover the sale total', () => {
    payableNotesCasesMock.forEach(({ total, notes }) => {
      expect(payableNotes(total)).toEqual(notes)
    })
  })

  it('never offers more than three notes', () => {
    expect(payableNotes(0)).toHaveLength(3)
  })

  it('drops the note worth exactly the total', () => {
    expect(payableNotes(50)).not.toContain(50)
  })
})
