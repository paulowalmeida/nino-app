import { describe, expect, it, vi } from 'vitest'

import { setStep } from './set-step'
import { counterSetStepMock } from './set-step.mock'

describe(setStep.name, () => {
  it('sets the current step', () => {
    const set = vi.fn()
    setStep(set, counterSetStepMock.step)
    expect(set).toHaveBeenCalledWith(counterSetStepMock)
  })
})
