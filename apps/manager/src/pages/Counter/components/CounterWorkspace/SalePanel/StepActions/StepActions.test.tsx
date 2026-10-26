import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StepActions } from './StepActions'
import { stepActionsMock } from './StepActions.mock'

describe('StepActions', () => {
  it('fires continue and back actions', () => {
    const onBack = vi.fn()
    const onContinue = vi.fn()
    render(
      <StepActions
        {...stepActionsMock}
        onBack={onBack}
        onContinue={onContinue}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(onBack).toHaveBeenCalledOnce()
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
