import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

import { TenantStep } from './TenantStep'
import {
  tenantStepAccountMock,
  tenantStepCompanyMock,
  tenantStepMock,
} from './TenantStep.mock'

vi.mock('@pages/Register/facades/useRegisterFacade/useRegisterFacade')

const goToCompanyStep = vi.fn()
const fillSlugFromName = vi.fn()

const tenantFormWith = (overrides: Record<string, unknown>) => ({
  register: vi.fn(() => ({})),
  submit: vi.fn(),
  setValue: vi.fn(),
  setError: vi.fn(),
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
    tenantForm: tenantFormWith(overrides),
  } as unknown as ReturnType<typeof useRegisterFacade>)

describe('TenantStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade(tenantStepAccountMock, tenantStepCompanyMock)
  })

  it('renders the unit identity and address fields', () => {
    render(<TenantStep />)

    expect(
      screen.getByRole('heading', { name: tenantStepMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(tenantStepMock.nameLabel)).toBeInTheDocument()
    expect(screen.getByText('.dev.nino.delivery')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
  })

  it('returns to the company step', async () => {
    render(<TenantStep />)

    await userEvent.click(
      screen.getByRole('button', { name: tenantStepMock.backLabel })
    )

    expect(goToCompanyStep).toHaveBeenCalled()
  })

  it('shows the failure the facade reported', () => {
    mockFacade(tenantStepAccountMock, tenantStepCompanyMock, {
      formState: {
        errors: { root: { message: tenantStepMock.failureMessage } },
        isSubmitting: false,
      },
    })

    render(<TenantStep />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      tenantStepMock.failureMessage
    )
  })

  it('renders nothing when the registration context is incomplete', () => {
    mockFacade(null, null)

    const { container } = render(<TenantStep />)

    expect(container).toBeEmptyDOMElement()
  })
})
