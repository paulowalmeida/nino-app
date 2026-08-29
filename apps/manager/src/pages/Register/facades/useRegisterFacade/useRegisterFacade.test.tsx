import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAccountForm } from '@pages/Register/hooks/useAccountForm/useAccountForm'
import { useCompanyForm } from '@pages/Register/hooks/useCompanyForm/useCompanyForm'
import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import { useRegisterWizardStore } from '@pages/Register/states/register-wizard/register-wizard.store'

import { useRegisterFacade } from './useRegisterFacade'
import { facadeAccountMock } from './useRegisterFacade.mock'

vi.mock('@pages/Register/hooks/useAccountForm/useAccountForm')
vi.mock('@pages/Register/hooks/useCompanyForm/useCompanyForm')
vi.mock('@pages/Register/hooks/useSignup/useSignup')

const accountForm = { submit: vi.fn() }
const companyForm = { submit: vi.fn() }
const signup = { mutateAsync: vi.fn() }

describe('useRegisterFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    act(() => useRegisterWizardStore.getState().reset())
    vi.mocked(useAccountForm).mockReturnValue(
      accountForm as unknown as ReturnType<typeof useAccountForm>
    )
    vi.mocked(useCompanyForm).mockReturnValue(
      companyForm as unknown as ReturnType<typeof useCompanyForm>
    )
    vi.mocked(useSignup).mockReturnValue(
      signup as unknown as ReturnType<typeof useSignup>
    )
  })

  it('opens the wizard on the account step with both forms ready', () => {
    const { result } = renderHook(() => useRegisterFacade())

    expect(result.current.step).toBe(1)
    expect(result.current.account).toBeNull()
    expect(result.current.accountForm).toBe(accountForm)
    expect(result.current.companyForm).toBe(companyForm)
    expect(result.current.signup).toBe(signup)
    expect(useAccountForm).toHaveBeenCalledWith({
      defaultValues: null,
      onValid: useRegisterWizardStore.getState().goToCompany,
    })
    expect(useCompanyForm).toHaveBeenCalledWith({
      goToTenant: useRegisterWizardStore.getState().goToTenant,
    })
    expect(useSignup).toHaveBeenCalledWith()
  })

  it('feeds both forms with the account once the first step passes', () => {
    const { result } = renderHook(() => useRegisterFacade())

    act(() => useRegisterWizardStore.getState().goToCompany(facadeAccountMock))

    expect(result.current.step).toBe(2)
    expect(result.current.account).toBe(facadeAccountMock)
    expect(useCompanyForm).toHaveBeenLastCalledWith({
      goToTenant: useRegisterWizardStore.getState().goToTenant,
    })
  })

  it('exposes the wizard transitions the screen needs', () => {
    const { result } = renderHook(() => useRegisterFacade())

    act(() => useRegisterWizardStore.getState().goToCompany(facadeAccountMock))
    act(() => result.current.goToAccount())
    expect(result.current.step).toBe(1)

    act(() => result.current.resetWizard())
    expect(result.current.account).toBeNull()
  })
})
