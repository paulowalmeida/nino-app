import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { WizardFooter } from './WizardFooter'
import { wizardFooterMock } from './WizardFooter.mock'

describe('WizardFooter', () => {
  it('hides the back action on the first step', () => {
    render(
      <WizardFooter
        stepCount={3}
        currentStep={0}
        showBack={false}
        onBack={vi.fn()}
        onAdvance={vi.fn()}
        advanceLabel={wizardFooterMock.advanceLabel}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Voltar' })
    ).not.toBeInTheDocument()
  })

  it('walks back a step', async () => {
    const onBack = vi.fn()
    render(
      <WizardFooter
        stepCount={3}
        currentStep={1}
        showBack
        onBack={onBack}
        onAdvance={vi.fn()}
        advanceLabel={wizardFooterMock.advanceLabel}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(onBack).toHaveBeenCalled()
  })

  it('advances with the label the current step decides', async () => {
    const onAdvance = vi.fn()
    render(
      <WizardFooter
        stepCount={3}
        currentStep={2}
        showBack
        onBack={vi.fn()}
        onAdvance={onAdvance}
        advanceLabel={wizardFooterMock.finalLabel}
      />
    )

    await userEvent.click(
      screen.getByRole('button', { name: wizardFooterMock.finalLabel })
    )

    expect(onAdvance).toHaveBeenCalled()
  })
})
