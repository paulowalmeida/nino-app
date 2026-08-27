import { MemoryRouter } from 'react-router'

import { act, renderHook, waitFor } from '@testing-library/react'
import type { UseFormSetValue } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import type { CompanyFormValues } from '@pages/Register/types/CompanyFormValues.type'
import type { SignupAccount } from '@shared/types/auth/signup-account'

import { useCompanyForm } from './useCompanyForm'
import {
  companyAccountMock,
  companyFormMock,
  companyValuesMock,
} from './useCompanyForm.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@pages/Register/hooks/useSignup/useSignup')
vi.mock('@pages/Register/hooks/useCheckAvailability/useCheckAvailability')

const checkAvailability = vi.fn()
const signup = vi.fn()

/* O formState do react-hook-form so avisa sobre o que foi lido no render:
   ler os erros aqui e' o que faz o teste enxergar a mudanca. */
const renderCompanyForm = (account: SignupAccount | null) =>
  renderHook(
    () => {
      const form = useCompanyForm({ account })
      return { ...form, errors: form.formState.errors }
    },
    { wrapper: MemoryRouter }
  )

const fillCompany = (setValue: UseFormSetValue<CompanyFormValues>) =>
  act(() => setValue('company', companyValuesMock))

describe('useCompanyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCheckAvailability).mockReturnValue({
      mutateAsync: checkAvailability,
    } as unknown as ReturnType<typeof useCheckAvailability>)
    vi.mocked(useSignup).mockReturnValue({
      mutateAsync: signup,
    } as unknown as ReturnType<typeof useSignup>)
  })

  it('creates account and company together and opens the app', async () => {
    checkAvailability.mockResolvedValue({ cnpj: true })
    signup.mockResolvedValue(undefined)
    const { result } = renderCompanyForm(companyAccountMock)
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    expect(checkAvailability).toHaveBeenCalledWith({
      cnpj: companyValuesMock.cnpj,
    })
    expect(signup).toHaveBeenCalledWith({
      account: companyAccountMock,
      company: companyValuesMock,
    })
    expect(navigate).toHaveBeenCalledWith(companyFormMock.home)
  })

  it('points at the CNPJ that already belongs to someone', async () => {
    checkAvailability.mockResolvedValue({ cnpj: false })
    const { result } = renderCompanyForm(companyAccountMock)
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() =>
      expect(result.current.errors.company?.cnpj?.message).toBe(
        companyFormMock.takenCnpjMessage
      )
    )
    expect(signup).not.toHaveBeenCalled()
  })

  it('explains the failure without leaving the step', async () => {
    checkAvailability.mockResolvedValue({ cnpj: true })
    signup.mockRejectedValue(new Error('offline'))
    const { result } = renderCompanyForm(companyAccountMock)
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() =>
      expect(result.current.errors.root?.message).toBe(
        companyFormMock.failureMessage
      )
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it('sends nothing while the account step has not been passed', async () => {
    const { result } = renderCompanyForm(null)
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    expect(checkAvailability).not.toHaveBeenCalled()
    expect(signup).not.toHaveBeenCalled()
  })
})
