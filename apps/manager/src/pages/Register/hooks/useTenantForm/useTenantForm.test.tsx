import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSignup } from '@pages/Register/hooks/useSignup/useSignup'
import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

import { useTenantForm } from './useTenantForm'
import {
  tenantAccountMock,
  tenantCompanyMock,
  tenantFormMock,
  tenantValuesMock,
} from './useTenantForm.mock'

const navigate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@pages/Register/hooks/useSignup/useSignup')

const signup = vi.fn()

/* O formState do react-hook-form só avisa sobre o que foi lido no render:
   ler os erros aqui é o que faz o teste enxergar a mudança. */
const renderTenantForm = (
  account: SignupAccount | null = tenantAccountMock,
  company: SignupCompany | null = tenantCompanyMock
) =>
  renderHook(() => {
    const form = useTenantForm({ account, company })
    return { ...form, errors: form.formState.errors }
  })

const fillTenant = (result: {
  current: { setValue: ReturnType<typeof useTenantForm>['setValue'] }
}) =>
  act(() => {
    Object.entries(tenantValuesMock).forEach(([field, value]) =>
      result.current.setValue(
        field as keyof typeof tenantValuesMock,
        value as string
      )
    )
  })

describe('useTenantForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSignup).mockReturnValue({
      mutateAsync: signup,
    } as unknown as ReturnType<typeof useSignup>)
  })

  it('suggests the unit name and public address from the company', () => {
    const { result } = renderTenantForm()

    expect(result.current.getValues('customName')).toBe(tenantCompanyMock.name)
    expect(result.current.getValues('slug')).toBe('padoca-do-bairro')
  })

  it('creates the account and opens the workspace', async () => {
    // Arrange
    signup.mockResolvedValue(undefined)
    const { result } = renderTenantForm()
    fillTenant(result)

    // Act
    await act(async () => {
      await result.current.submit()
    })

    // Assert: o CEP chega ao serviço sem máscara
    expect(signup).toHaveBeenCalledWith({
      account: tenantAccountMock,
      company: tenantCompanyMock,
      tenant: expect.objectContaining({
        slug: 'padoca-centro',
        zipCode: '66000000',
        complement: undefined,
      }),
    })
    expect(navigate).toHaveBeenCalledWith(tenantFormMock.home)
  })

  it('derives the public address from the unit name while it is empty', () => {
    // Arrange
    const { result } = renderTenantForm()
    act(() => {
      result.current.setValue('customName', 'Padoca Centro')
      result.current.setValue('slug', '')
    })

    // Act
    act(() => result.current.fillSlugFromName())

    // Assert
    expect(result.current.getValues('slug')).toBe('padoca-centro')
  })

  it('keeps a public address that was typed by hand', () => {
    // Arrange
    const { result } = renderTenantForm()
    act(() => {
      result.current.setValue('customName', 'Padoca Centro')
      result.current.setValue('slug', 'custom-slug')
    })

    // Act
    act(() => result.current.fillSlugFromName())

    // Assert
    expect(result.current.getValues('slug')).toBe('custom-slug')
  })

  it('explains the failure without leaving the step', async () => {
    // Arrange
    signup.mockRejectedValue(new Error('offline'))
    const { result } = renderTenantForm()
    fillTenant(result)

    // Act
    await act(async () => {
      await result.current.submit()
    })

    // Assert
    await waitFor(() =>
      expect(result.current.errors.root?.message).toBe(
        tenantFormMock.failureMessage
      )
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it('does not sign up while the previous steps are incomplete', async () => {
    // Arrange
    const { result } = renderTenantForm(null, null)
    fillTenant(result)

    // Act
    await act(async () => {
      await result.current.submit()
    })

    // Assert
    expect(signup).not.toHaveBeenCalled()
  })
})
