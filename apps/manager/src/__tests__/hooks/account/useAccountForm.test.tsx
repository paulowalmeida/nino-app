import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAccountForm } from '@hooks/account/useAccountForm'
import { AccountService } from '@services/account.service'

import { profileWithEmail } from './useAccountForm.mock'

vi.mock('@services/account.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useAccountForm.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('seeds the draft once the profile loads', async () => {
    // Arrange
    const client = new QueryClient()
    type Props = { profile: typeof profileWithEmail | undefined }
    const initialProps: Props = { profile: undefined }
    const { result, rerender } = renderHook(
      ({ profile }: Props) => useAccountForm(profile),
      { wrapper: wrapWithClient(client), initialProps }
    )

    // Act
    rerender({ profile: profileWithEmail })

    // Assert
    await waitFor(() =>
      expect(result.current.draft).toEqual({
        name: 'Maria Silva',
        phone: '(85) 99999-8888',
        email: 'maria@example.com',
      })
    )
  })

  it('marks the form dirty and clears errors on change', () => {
    // Arrange
    const client = new QueryClient()
    const { result } = renderHook(() => useAccountForm(profileWithEmail), {
      wrapper: wrapWithClient(client),
    })

    // Act
    act(() => result.current.change({ name: 'Maria Souza' }))

    // Assert
    expect(result.current.isDirty).toBe(true)
    expect(result.current.emailError).toBeNull()
  })

  it('blocks saving and reports an error for an invalid email', async () => {
    // Arrange
    const client = new QueryClient()
    const { result } = renderHook(() => useAccountForm(profileWithEmail), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.change({ email: 'not-an-email' }))

    // Act
    await act(async () => result.current.handleSave())

    // Assert
    expect(result.current.emailError).toBe('E-mail inválido')
    expect(AccountService.updateProfile).not.toHaveBeenCalled()
  })

  it('saves the profile and updates the email when it changed', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AccountService.updateProfile).mockResolvedValue(profileWithEmail)
    vi.mocked(AccountService.updateMyEmail).mockResolvedValue(
      profileWithEmail.credentials[0]
    )
    const { result } = renderHook(() => useAccountForm(profileWithEmail), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.change({ email: 'nova@example.com' }))

    // Act
    await act(async () => result.current.handleSave())

    // Assert
    expect(AccountService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Maria Silva' })
    )
    expect(AccountService.updateMyEmail).toHaveBeenCalledWith(
      'nova@example.com'
    )
    expect(result.current.saveError).toBeNull()
  })

  it('reports a save error when the request fails', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AccountService.updateProfile).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useAccountForm(profileWithEmail), {
      wrapper: wrapWithClient(client),
    })
    act(() => result.current.change({ name: 'Maria Souza' }))

    // Act
    await act(async () => result.current.handleSave())

    // Assert
    expect(result.current.saveError).toBe(
      'Não foi possível salvar. Confira os dados e tente de novo.'
    )
  })
})
