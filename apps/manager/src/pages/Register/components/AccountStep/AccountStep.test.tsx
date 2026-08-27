import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'

import { AccountStep } from './AccountStep'
import { accountStepMock } from './AccountStep.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const submit = vi.fn()
const getValues = vi.fn(() => accountStepMock.currentPassword)
type RegisterCall = (field: string, options?: Record<string, unknown>) => object

const register = vi.fn<RegisterCall>(() => ({}))

const accountFormWith = (overrides: Record<string, unknown>) => ({
  register,
  submit,
  getValues,
  watch: vi.fn(() => undefined),
  formState: { errors: {}, isSubmitting: false },
  ...overrides,
})

const mockFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    accountForm: accountFormWith(overrides),
  } as unknown as ReturnType<typeof useRegisterFacade>)

const renderStep = () =>
  render(
    <MemoryRouter>
      <AccountStep />
    </MemoryRouter>
  )

describe('AccountStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade()
  })

  it('asks for the owner data before the company', () => {
    renderStep()

    expect(
      screen.getByRole('heading', { name: accountStepMock.heading })
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(accountStepMock.nameLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(accountStepMock.emailLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: accountStepMock.loginLink })
    ).toBeInTheDocument()
  })

  it('grades the password once there is one to grade', () => {
    mockFacade({ watch: vi.fn(() => accountStepMock.typedPassword) })

    renderStep()

    expect(screen.getByRole('meter')).toBeInTheDocument()
  })

  it('confirms the password against what was typed first', () => {
    renderStep()

    const call = register.mock.calls.find(
      ([field]) => field === 'confirmPassword'
    )
    if (!call) throw new Error('confirmPassword was not registered')
    const options = call[1] as {
      validate: (value: string) => string | boolean
    }

    expect(options.validate(accountStepMock.currentPassword)).toBe(true)
    expect(options.validate('outra-coisa')).toBe(
      accountStepMock.mismatchMessage
    )
    expect(getValues).toHaveBeenCalledWith('password')
  })

  it('hands the step over to the facade on submit', async () => {
    renderStep()

    await userEvent.click(
      screen.getByRole('button', { name: accountStepMock.submitLabel })
    )

    expect(submit).toHaveBeenCalled()
  })

  it('shows the failure the facade reported', () => {
    mockFacade({
      formState: {
        errors: { root: { message: accountStepMock.rootErrorMessage } },
        isSubmitting: false,
      },
    })

    renderStep()

    expect(
      screen.getByText(accountStepMock.rootErrorMessage)
    ).toBeInTheDocument()
  })

  it('holds the button busy while the account is being checked', () => {
    mockFacade({ formState: { errors: {}, isSubmitting: true } })

    renderStep()

    expect(
      screen.getByRole('button', { name: 'Carregando' })
    ).toBeDisabled()
  })
})
