import { afterEach, describe, expect, it, vi } from 'vitest'

import { clearDraft, readDraft, writeDraft } from './form-draft'

type Draft = { name: string }

describe('form-draft', () => {
  afterEach(() => window.localStorage.clear())

  it('round-trips a draft through write and read', () => {
    // Arrange
    writeDraft<Draft>('unit', { name: 'Padoca' })

    // Act
    const draft = readDraft<Draft>('unit')

    // Assert
    expect(draft).toEqual({ name: 'Padoca' })
  })

  it('reads null for a key that was never written', () => {
    expect(readDraft('missing')).toBeNull()
  })

  it('forgets the draft once cleared', () => {
    // Arrange
    writeDraft<Draft>('unit', { name: 'Padoca' })

    // Act
    clearDraft('unit')

    // Assert
    expect(readDraft('unit')).toBeNull()
  })

  it('reads null instead of throwing on corrupted storage', () => {
    // Arrange
    window.localStorage.setItem('nino.draft.unit', '{not json')

    // Act / Assert
    expect(readDraft('unit')).toBeNull()
  })

  it('does not throw when storage write fails', () => {
    // Arrange
    const setItem = vi
      .spyOn(window.localStorage.__proto__, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })

    // Act / Assert
    expect(() => writeDraft<Draft>('unit', { name: 'Padoca' })).not.toThrow()

    setItem.mockRestore()
  })
})
