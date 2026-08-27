import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import { Register } from './Register'
import { registerPageMock } from './Register.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')
vi.mock('@pages/Register/components/RegisterStepper/RegisterStepper', () => ({
  RegisterStepper: () => <div>indicador de progresso</div>,
}))
vi.mock('@pages/Register/components/AccountStep/AccountStep', () => ({
  AccountStep: () => <div>passo conta</div>,
}))
vi.mock('@pages/Register/components/CompanyStep/CompanyStep', () => ({
  CompanyStep: () => <div>passo empresa</div>,
}))

const resetWizard = vi.fn()

const mockStep = (step: 1 | 2) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    step,
    resetWizard,
  } as unknown as ReturnType<typeof useRegisterFacade>)

describe('Register', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts the wizard fresh on every visit', () => {
    mockStep(1)

    render(<Register />)

    expect(resetWizard).toHaveBeenCalled()
    expect(
      screen.getByText(registerPageMock.stepperLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByText(registerPageMock.accountStepLabel)
    ).toBeInTheDocument()
  })

  it('shows the company step once the account step passed', () => {
    mockStep(2)

    render(<Register />)

    expect(
      screen.getByText(registerPageMock.companyStepLabel)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(registerPageMock.accountStepLabel)
    ).not.toBeInTheDocument()
  })
})
