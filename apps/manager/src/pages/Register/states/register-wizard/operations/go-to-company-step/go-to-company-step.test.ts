import { describe, expect, it, vi } from 'vitest'

import { goToCompanyStep } from './go-to-company-step'
import { goToCompanyStepMock } from './go-to-company-step.mock'

describe('goToCompanyStep', () => {
  it('returns to the company step without clearing the form data', () => {
    const set = vi.fn()

    goToCompanyStep(set)

    expect(set).toHaveBeenCalledWith({
      step: goToCompanyStepMock.expectedStep,
    })
  })
})
