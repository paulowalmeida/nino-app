import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import type { SignupAccount } from '@shared/types/auth/signup-account'

import { CompanyStep } from './CompanyStep'
import { companyStepAccountMock, companyStepMock } from './CompanyStep.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const goToAccount = vi.fn()

const companyFormWith = (overrides: Record<string, unknown>) => ({
  register: vi.fn(() => ({})),
  submit: vi.fn(),
  formState: { errors: {}, isSubmitting: false },
  ...overrides,
})

const mockFacade = (
  account: SignupAccount | null,
  overrides: Record<string, unknown> = {}
) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    account,
    goToAccount,
    companyForm: companyFormWith(overrides),
  } as unknown as ReturnType<typeof useRegisterFacade>)

describe('CompanyStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade(companyStepAccountMock)
  })

  it('greets the owner by the first name saved in the previous step', () => {
    render(<CompanyStep />)

    expect(
      screen.getByRole('heading', { name: companyStepMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByText(companyStepMock.greeting)).toBeInTheDocument()
    expect(screen.getByLabelText(companyStepMock.cnpjLabel)).toBeInTheDocument()
  })

  it('walks back to the account step', async () => {
    render(<CompanyStep />)

    await userEvent.click(
      screen.getByRole('button', { name: companyStepMock.backLabel })
    )

    expect(goToAccount).toHaveBeenCalled()
  })

  it('shows the failure the facade reported', () => {
    mockFacade(companyStepAccountMock, {
      formState: {
        errors: { root: { message: companyStepMock.rootErrorMessage } },
        isSubmitting: false,
      },
    })

    render(<CompanyStep />)

    expect(
      screen.getByText(companyStepMock.rootErrorMessage)
    ).toBeInTheDocument()
  })

  it('holds both buttons busy while creating the account', () => {
    mockFacade(companyStepAccountMock, {
      formState: { errors: {}, isSubmitting: true },
    })

    render(<CompanyStep />)

    expect(
      screen.getByRole('button', { name: companyStepMock.backLabel })
    ).toBeDisabled()
  })

  it('renders nothing without an account from the first step', () => {
    mockFacade(null)

    const { container } = render(<CompanyStep />)

    expect(container).toBeEmptyDOMElement()
  })
})
