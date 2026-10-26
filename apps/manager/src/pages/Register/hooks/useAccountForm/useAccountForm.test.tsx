import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckAvailability } from '@pages/Register/hooks/useCheckAvailability/useCheckAvailability'
import type { SignupAccount } from '@shared/types/auth/signup-account'

import { useAccountForm } from './useAccountForm'
import { accountDefaultsMock, accountFormMock } from './useAccountForm.mock'

vi.mock('@pages/Register/hooks/useCheckAvailability/useCheckAvailability')

const checkAvailability = vi.fn()
const onValid = vi.fn()

/* O formState do react-hook-form so avisa sobre o que foi lido no render:
   ler os erros aqui e' o que faz o teste enxergar a mudanca. */
const renderAccountForm = (defaultValues: SignupAccount | null) =>
  renderHook(() => {
    const form = useAccountForm({ defaultValues, onValid })
    return { ...form, errors: form.formState.errors }
  })

const submitForm = async (submit: () => Promise<void>) => {
  await act(async () => {
    await submit()
  })
}

describe('useAccountForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCheckAvailability).mockReturnValue({
      mutateAsync: checkAvailability,
    } as unknown as ReturnType<typeof useCheckAvailability>)
  })

  it('reopens with what the owner had already typed', () => {
    const { result } = renderAccountForm(accountDefaultsMock)

    expect(result.current.getValues('email')).toBe(accountDefaultsMock.email)
    expect(result.current.getValues('confirmPassword')).toBe(
      accountDefaultsMock.password
    )
  })

  it('opens empty on the first visit', () => {
    const { result } = renderAccountForm(null)

    expect(result.current.getValues('email')).toBeUndefined()
  })

  it('hands the account over when e-mail and CPF are free', async () => {
    checkAvailability.mockResolvedValue({ email: true, cpf: true })
    const { result } = renderAccountForm(accountDefaultsMock)

    await submitForm(result.current.submit)

    expect(checkAvailability).toHaveBeenCalledWith({
      email: accountDefaultsMock.email,
      cpf: accountDefaultsMock.cpf,
    })
    expect(onValid).toHaveBeenCalledWith(accountDefaultsMock)
  })

  it('points at the very field that is already registered', async () => {
    checkAvailability.mockResolvedValue({ email: false, cpf: false })
    const { result } = renderAccountForm(accountDefaultsMock)

    await submitForm(result.current.submit)

    await waitFor(() =>
      expect(result.current.errors.email?.message).toBe(
        accountFormMock.takenEmailMessage
      )
    )
    expect(result.current.errors.cpf?.message).toBe(
      accountFormMock.takenCpfMessage
    )
    expect(onValid).not.toHaveBeenCalled()
  })

  it('keeps the owner on the step when the check itself fails', async () => {
    checkAvailability.mockRejectedValue(new Error('offline'))
    const { result } = renderAccountForm(accountDefaultsMock)

    await submitForm(result.current.submit)

    await waitFor(() =>
      expect(result.current.errors.root?.message).toBe(
        accountFormMock.checkFailedMessage
      )
    )
    expect(onValid).not.toHaveBeenCalled()
  })
})
