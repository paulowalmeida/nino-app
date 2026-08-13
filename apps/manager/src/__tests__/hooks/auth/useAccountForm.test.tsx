import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { useAccountForm } from '@hooks/auth/useAccountForm'

import {
  bothAvailable,
  cpfTaken,
  emailTaken,
  filledAccount,
} from './useAccountForm.mock'

vi.mock('@hooks/auth/useCheckAvailability')

const mockAvailability = (
  answer: Record<string, boolean> | Error = bothAvailable
) => {
  const mutateAsync =
    answer instanceof Error
      ? vi.fn().mockRejectedValue(answer)
      : vi.fn().mockResolvedValue(answer)

  vi.mocked(useCheckAvailability).mockReturnValue({
    mutateAsync,
  } as unknown as ReturnType<typeof useCheckAvailability>)

  return mutateAsync
}

/* `formState` do RHF é um proxy: quem não o lê durante o render não é
   avisado quando um erro aparece. Ler aqui é o que faz o hook re-renderizar
   no teste, como a tela faz ao desenhar a mensagem. */
const renderFilledForm = (onValid = vi.fn()) => {
  const { result } = renderHook(() => {
    const form = useAccountForm({ defaultValues: filledAccount, onValid })
    void form.formState.errors

    return form
  })

  return { result, onValid }
}

describe(useAccountForm.name, () => {
  it('hands the account over once e-mail and CPF are free', async () => {
    // Arrange
    mockAvailability(bothAvailable)
    const { result, onValid } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() => expect(onValid).toHaveBeenCalledWith(filledAccount))
  })

  it('drops confirmPassword before handing the account over', async () => {
    // Arrange
    mockAvailability(bothAvailable)
    const { result, onValid } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(onValid.mock.calls[0][0]).not.toHaveProperty('confirmPassword')
    )
  })

  it('marks the e-mail field when the address is already taken', async () => {
    // Arrange
    mockAvailability(emailTaken)
    const { result, onValid } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.email?.message).toBe(
        'E-mail já cadastrado'
      )
    )
    expect(onValid).not.toHaveBeenCalled()
  })

  it('marks the CPF field when the document is already taken', async () => {
    // Arrange
    mockAvailability(cpfTaken)
    const { result, onValid } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.cpf?.message).toBe(
        'CPF já cadastrado'
      )
    )
    expect(onValid).not.toHaveBeenCalled()
  })

  it('reports a failed check without blaming a single field', async () => {
    // Arrange
    mockAvailability(new Error('offline'))
    const { result, onValid } = renderFilledForm()

    // Act
    await result.current.submit()

    // Assert
    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        'Não foi possível validar os dados. Tente de novo.'
      )
    )
    expect(onValid).not.toHaveBeenCalled()
  })

  it('fills the confirmation with the password it was given back', () => {
    // Arrange
    mockAvailability(bothAvailable)

    // Act
    const { result } = renderFilledForm()

    // Assert
    expect(result.current.getValues('confirmPassword')).toBe(
      filledAccount.password
    )
  })

  it('starts empty when the person has not typed anything yet', () => {
    // Arrange
    mockAvailability(bothAvailable)

    // Act
    const { result } = renderHook(() =>
      useAccountForm({ defaultValues: null, onValid: vi.fn() })
    )

    // Assert
    expect(result.current.getValues('email')).toBeUndefined()
  })
})
