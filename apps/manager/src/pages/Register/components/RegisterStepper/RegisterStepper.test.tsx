import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import { RegisterStepper } from './RegisterStepper'
import { registerStepperMock } from './RegisterStepper.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const goToAccount = vi.fn()

const mockStep = (step: 1 | 2) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    step,
    goToAccount,
  } as unknown as ReturnType<typeof useRegisterFacade>)

describe('RegisterStepper', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows both steps of the signup', () => {
    mockStep(1)

    render(<RegisterStepper />)

    expect(
      screen.getByText(registerStepperMock.accountStepLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByText(registerStepperMock.companyStepLabel)
    ).toBeInTheDocument()
  })

  it('walks back to the account step from the company step', async () => {
    mockStep(2)

    render(<RegisterStepper />)
    await userEvent.click(
      screen.getByRole('button', {
        name: registerStepperMock.accountStepLabel,
      })
    )

    expect(goToAccount).toHaveBeenCalled()
  })

  it('does not skip ahead from the account step', async () => {
    mockStep(1)

    render(<RegisterStepper />)
    await userEvent.click(
      screen.getByRole('button', {
        name: registerStepperMock.companyStepLabel,
      })
    )

    expect(goToAccount).not.toHaveBeenCalled()
  })
})
