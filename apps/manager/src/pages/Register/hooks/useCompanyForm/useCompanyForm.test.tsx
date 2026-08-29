import { act, renderHook, waitFor } from '@testing-library/react'
import type { UseFormSetValue } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import type { CompanyFormValues } from '@pages/Register/types/CompanyFormValues.type'

import { useCompanyForm } from './useCompanyForm'
import {
  companyFormMock,
  companyValuesMock,
} from './useCompanyForm.mock'

vi.mock('@pages/Register/hooks/useCheckAvailability/useCheckAvailability')

const checkAvailability = vi.fn()
const goToTenant = vi.fn()

/* O formState do react-hook-form so avisa sobre o que foi lido no render:
   ler os erros aqui e' o que faz o teste enxergar a mudanca. */
const renderCompanyForm = () =>
  renderHook(
    () => {
      const form = useCompanyForm({ goToTenant })
      return { ...form, errors: form.formState.errors }
    }
  )

const fillCompany = (setValue: UseFormSetValue<CompanyFormValues>) =>
  act(() => setValue('company', companyValuesMock))

describe('useCompanyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCheckAvailability).mockReturnValue({
      mutateAsync: checkAvailability,
    } as unknown as ReturnType<typeof useCheckAvailability>)
  })

  it('validates the company and opens the unit step', async () => {
    checkAvailability.mockResolvedValue({ cnpj: true })
    const { result } = renderCompanyForm()
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    expect(checkAvailability).toHaveBeenCalledWith({
      cnpj: companyValuesMock.cnpj,
    })
    expect(goToTenant).toHaveBeenCalledWith(companyValuesMock)
  })

  it('points at the CNPJ that already belongs to someone', async () => {
    checkAvailability.mockResolvedValue({ cnpj: false })
    const { result } = renderCompanyForm()
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() =>
      expect(result.current.errors.company?.cnpj?.message).toBe(
        companyFormMock.takenCnpjMessage
      )
    )
    expect(goToTenant).not.toHaveBeenCalled()
  })

  it('explains the failure without leaving the step', async () => {
    checkAvailability.mockRejectedValue(new Error('offline'))
    const { result } = renderCompanyForm()
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() =>
      expect(result.current.errors.root?.message).toBe(
        'Não foi possível validar o CNPJ. Tente de novo.'
      )
    )
    expect(goToTenant).not.toHaveBeenCalled()
  })

  it('does not advance when the company is unavailable', async () => {
    const { result } = renderCompanyForm()
    fillCompany(result.current.setValue)

    await act(async () => {
      await result.current.submit()
    })

    expect(goToTenant).not.toHaveBeenCalled()
  })
})
