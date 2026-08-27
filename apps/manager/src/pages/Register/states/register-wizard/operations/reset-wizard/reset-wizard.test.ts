import { describe, expect, it, vi } from 'vitest'

import { resetWizard } from './reset-wizard'
import { resetWizardMock } from './reset-wizard.mock'

describe('resetWizard', () => {
  it('sends the wizard back to an empty first step', () => {
    const set = vi.fn()

    resetWizard(set)

    expect(set).toHaveBeenCalledWith({
      step: resetWizardMock.expectedStep,
      account: null,
    })
  })
})
