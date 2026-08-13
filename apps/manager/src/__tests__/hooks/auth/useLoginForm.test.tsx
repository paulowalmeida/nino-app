import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { useLogin } from '@hooks/auth/useLogin'
import { useLoginForm } from '@hooks/auth/useLoginForm'

vi.mock('@hooks/auth/useLogin')

const credentials = { email: 'ze@lanchonete.com', password: 'segredo123' }

const mockLogin = (outcome?: Error) => {
  const mutateAsync = outcome
    ? vi.fn().mockRejectedValue(outcome)
    : vi.fn().mockResolvedValue(undefined)

  vi.mocked(useLogin).mockReturnValue({
    mutateAsync,
  } as unknown as ReturnType<typeof useLogin>)

  return mutateAsync
}

/* `formState` do RHF é um proxy: quem não o lê durante o render não é
   avisado quando um erro aparece. */
const renderFilledForm = () => {
  const { result } = renderHook(() => {
    const form = useLoginForm()
    void form.formState.errors

    return form
  })

  result.current.setValue('email', credentials.email)
  result.current.setValue('password', credentials.password)

  return result
}

describe(useLoginForm.name, () => {
  it('sends the typed credentials', async () => {
    // Arrange
    const mutateAsync = mockLogin()
    const result = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith(credentials))
  })

  it('says the credentials do not match, without naming a field', async () => {
    // Arrange
    mockLogin(new ApiError(401, 'Unauthorized'))
    const result = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'E-mail ou senha incorretos.'
      )
    )
    expect(result.current.formState.errors.email).toBeUndefined()
  })

  it('asks the person to wait after too many attempts', async () => {
    // Arrange
    mockLogin(new ApiError(429, 'Too Many Requests'))
    const result = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'Muitas tentativas. Aguarde um momento e tente de novo.'
      )
    )
  })

  it('blames the connection when the request never lands', async () => {
    // Arrange
    mockLogin(new Error('Failed to fetch'))
    const result = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'Falha de conexão. Verifique sua internet e tente de novo.'
      )
    )
  })

  it('clears a previous failure when the person tries again', async () => {
    // Arrange
    mockLogin(new ApiError(401, 'Unauthorized'))
    const result = renderFilledForm()
    await result.current.submit()
    await waitFor(() =>
      expect(result.current.formState.errors.root).toBeDefined()
    )

    // Act
    mockLogin()
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root).toBeUndefined()
    )
  })
})
