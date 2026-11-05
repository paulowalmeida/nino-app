import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

import { UnitStep } from './UnitStep'
import {
  unitStepAccountMock,
  unitStepCompanyMock,
  unitStepMock,
} from './UnitStep.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')
vi.mock(
  '@shared/components/StoreForm/StoreFormAddressFields/StoreFormAddressFields',
  () => ({ StoreFormAddressFields: () => <div>endereço da loja</div> })
)

const goToCompanyStep = vi.fn()
const fillSlugFromName = vi.fn()

const unitFormWith = (overrides: Record<string, unknown>) => ({
  register: vi.fn(() => ({})),
  submit: vi.fn(),
  control: {},
  setValue: vi.fn(),
  fillSlugFromName,
  formState: { errors: {}, isSubmitting: false },
  ...overrides,
})

const mockFacade = (
  account: SignupAccount | null,
  company: SignupCompany | null,
  overrides: Record<string, unknown> = {}
) =>
  vi.mocked(useRegisterFacade).mockReturnValue({
    account,
    company,
    goToCompanyStep,
    unitForm: unitFormWith(overrides),
  } as unknown as ReturnType<typeof useRegisterFacade>)

describe('UnitStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade(unitStepAccountMock, unitStepCompanyMock)
  })

  it('renders the unit identity and address fields', () => {
    render(<UnitStep />)

    expect(
      screen.getByRole('heading', { name: unitStepMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(unitStepMock.nameLabel)).toBeInTheDocument()
    expect(screen.getByText('.dev.nino.delivery')).toBeInTheDocument()
    expect(screen.getByText('endereço da loja')).toBeInTheDocument()
  })

  it('returns to the company step', async () => {
    render(<UnitStep />)

    await userEvent.click(
      screen.getByRole('button', { name: unitStepMock.backLabel })
    )

    expect(goToCompanyStep).toHaveBeenCalled()
  })

  it('shows the failure the facade reported', () => {
    mockFacade(unitStepAccountMock, unitStepCompanyMock, {
      formState: {
        errors: { root: { message: unitStepMock.failureMessage } },
        isSubmitting: false,
      },
    })

    render(<UnitStep />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      unitStepMock.failureMessage
    )
  })

  it('renders nothing when the registration context is incomplete', () => {
    mockFacade(null, null)

    const { container } = render(<UnitStep />)

    expect(container).toBeEmptyDOMElement()
  })
})
