import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import { RegisterStepper } from './RegisterStepper'
import { registerStepperMock } from './RegisterStepper.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const mockStep = (step: 1 | 2) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    step,
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

  it('tracks progress without offering the steps as controls', () => {
    // Arrange: o cadastro avançou para o segundo passo
    mockStep(2)

    // Act
    render(<RegisterStepper />)

    // Assert: o caminho é indicador, não navegação
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
