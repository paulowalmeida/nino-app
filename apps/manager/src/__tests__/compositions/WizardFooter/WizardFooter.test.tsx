import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { WizardFooter } from '@compositions/WizardFooter/WizardFooter'

describe(WizardFooter.name, () => {
  it('hides the back button on the first step', () => {
    // Arrange / Act
    render(
      <WizardFooter
        stepCount={3}
        currentStep={0}
        showBack={false}
        onBack={vi.fn()}
        onAdvance={vi.fn()}
        advanceLabel="Continuar"
      />
    )

    // Assert
    expect(screen.queryByText('Voltar')).not.toBeInTheDocument()
  })

  it('calls onBack when the back button is clicked', async () => {
    // Arrange
    const onBack = vi.fn()
    render(
      <WizardFooter
        stepCount={3}
        currentStep={1}
        showBack
        onBack={onBack}
        onAdvance={vi.fn()}
        advanceLabel="Continuar"
      />
    )

    // Act
    await userEvent.click(screen.getByText('Voltar'))

    // Assert
    expect(onBack).toHaveBeenCalled()
  })

  it('calls onAdvance with the given label when advancing', async () => {
    // Arrange
    const onAdvance = vi.fn()
    render(
      <WizardFooter
        stepCount={3}
        currentStep={2}
        showBack
        onBack={vi.fn()}
        onAdvance={onAdvance}
        advanceLabel="Ir para minha loja"
      />
    )

    // Act
    await userEvent.click(screen.getByText('Ir para minha loja'))

    // Assert
    expect(onAdvance).toHaveBeenCalled()
  })
})
