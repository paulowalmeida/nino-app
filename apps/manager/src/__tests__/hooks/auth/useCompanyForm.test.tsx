import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { useCompanyForm } from '@hooks/auth/useCompanyForm'
import { useSignup } from '@hooks/auth/useSignup'

import {
  cnpjAvailable,
  cnpjTaken,
  signedUpAccount,
  typedCompany,
} from './useCompanyForm.mock'

vi.mock('@hooks/auth/useCheckAvailability')
vi.mock('@hooks/auth/useSignup')

const mockFlow = ({
  availability = cnpjAvailable,
  signupError,
}: {
  availability?: { cnpj: boolean }
  signupError?: Error
} = {}) => {
  vi.mocked(useCheckAvailability).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(availability),
  } as unknown as ReturnType<typeof useCheckAvailability>)

  const signup = signupError
    ? vi.fn().mockRejectedValue(signupError)
    : vi.fn().mockResolvedValue(undefined)

  vi.mocked(useSignup).mockReturnValue({
    mutateAsync: signup,
  } as unknown as ReturnType<typeof useSignup>)

  return signup
}

/* `formState` do RHF é um proxy: quem não o lê durante o render não é
   avisado quando um erro aparece. */
const renderFilledForm = (onSignedUp = vi.fn()) => {
  const { result } = renderHook(() => {
    const form = useCompanyForm({ account: signedUpAccount, onSignedUp })
    void form.formState.errors

    return form
  })

  result.current.setValue('company', typedCompany)

  return { result, onSignedUp }
}

describe(useCompanyForm.name, () => {
  it('signs up account and company together', async () => {
    // Arrange
    const signup = mockFlow()
    const { result, onSignedUp } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(signup).toHaveBeenCalledWith({
        account: signedUpAccount,
        company: typedCompany,
      })
    )
    expect(onSignedUp).toHaveBeenCalled()
  })

  it('marks the CNPJ field when the company already exists', async () => {
    // Arrange
    const signup = mockFlow({ availability: cnpjTaken })
    const { result, onSignedUp } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.company?.cnpj?.message).toBe(
        'CNPJ já cadastrado'
      )
    )
    expect(signup).not.toHaveBeenCalled()
    expect(onSignedUp).not.toHaveBeenCalled()
  })

  it('repeats what the API says on a conflict at signup', async () => {
    // Arrange
    mockFlow({ signupError: new ApiError(409, 'E-mail já cadastrado') })
    const { result, onSignedUp } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'E-mail já cadastrado'
      )
    )
    expect(onSignedUp).not.toHaveBeenCalled()
  })

  it('falls back to the generic line on any other failure', async () => {
    // Arrange
    mockFlow({ signupError: new Error('Failed to fetch') })
    const { result } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'Não foi possível concluir. Confira os dados e tente de novo.'
      )
    )
  })

  it('does not sign up while a field is empty', async () => {
    // Arrange
    const signup = mockFlow()
    const { result } = renderHook(() => {
      const form = useCompanyForm({
        account: signedUpAccount,
        onSignedUp: vi.fn(),
      })
      void form.formState.errors

      return form
    })

    // Act
    await result.current.submit()

    // Assert
    expect(signup).not.toHaveBeenCalled()
  })
})
