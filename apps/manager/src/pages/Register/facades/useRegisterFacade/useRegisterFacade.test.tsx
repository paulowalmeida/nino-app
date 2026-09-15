import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAccountForm } from '@pages/Register/hooks/useAccountForm/useAccountForm'
import { useCompanyForm } from '@pages/Register/hooks/useCompanyForm/useCompanyForm'
import { useUnitForm } from '@pages/Register/hooks/useUnitForm/useUnitForm'
import { useRegisterWizardStore } from '@pages/Register/states/register-wizard/register-wizard.store'

import { useRegisterFacade } from './useRegisterFacade'
import { facadeAccountMock } from './useRegisterFacade.mock'

vi.mock('@pages/Register/hooks/useAccountForm/useAccountForm')
vi.mock('@pages/Register/hooks/useCompanyForm/useCompanyForm')
vi.mock('@pages/Register/hooks/useUnitForm/useUnitForm')

const accountForm = { submit: vi.fn() }
const companyForm = { submit: vi.fn() }
const unitForm = { submit: vi.fn() }

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
    vi.mocked(useUnitForm).mockReturnValue(
      unitForm as unknown as ReturnType<typeof useUnitForm>
    )
  })

  it('opens the wizard on the account step with every form ready', () => {
    const { result } = renderHook(() => useRegisterFacade())

    expect(result.current.step).toBe(1)
    expect(result.current.account).toBeNull()
    expect(result.current.accountForm).toBe(accountForm)
    expect(result.current.companyForm).toBe(companyForm)
    expect(result.current.unitForm).toBe(unitForm)
    expect(useAccountForm).toHaveBeenCalledWith({
      defaultValues: null,
      onValid: useRegisterWizardStore.getState().goToCompany,
    })
    expect(useCompanyForm).toHaveBeenCalledWith({
      goToUnit: useRegisterWizardStore.getState().goToUnit,
    })
    expect(useUnitForm).toHaveBeenCalledWith({
      account: null,
      company: null,
    })
  })

  it('feeds the later forms with the account once the first step passes', () => {
    const { result } = renderHook(() => useRegisterFacade())

    act(() => useRegisterWizardStore.getState().goToCompany(facadeAccountMock))

    expect(result.current.step).toBe(2)
    expect(result.current.account).toBe(facadeAccountMock)
    expect(useCompanyForm).toHaveBeenLastCalledWith({
      goToUnit: useRegisterWizardStore.getState().goToUnit,
    })
    expect(useUnitForm).toHaveBeenLastCalledWith({
      account: facadeAccountMock,
      company: null,
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
