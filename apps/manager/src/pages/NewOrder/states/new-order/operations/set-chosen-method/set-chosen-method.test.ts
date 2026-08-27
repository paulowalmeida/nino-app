import { describe, expect, it, vi } from 'vitest'

import { setChosenMethod } from './set-chosen-method'
import { chosenMethodMock } from './set-chosen-method.mock'

describe('setChosenMethod', () => {
  it('writes the payment the attendant picked', () => {
    const set = vi.fn()

    setChosenMethod(set, chosenMethodMock)

    expect(set).toHaveBeenCalledWith({ chosenMethod: chosenMethodMock })
  })

  it('clears the pick back to the store default', () => {
    const set = vi.fn()

    setChosenMethod(set, null)

    expect(set).toHaveBeenCalledWith({ chosenMethod: null })
  })
})
