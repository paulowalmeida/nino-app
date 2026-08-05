import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { CredentialInfo } from '@custom_types/account/credential-info'
import { profileKey } from '@hooks/account/useProfile'
import { useUpdateMyEmail } from '@hooks/account/useUpdateMyEmail'
import { AccountService } from '@services/account.service'

import { profile } from './useProfile.mock'

vi.mock('@services/account.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useUpdateMyEmail.name, () => {
  it('invalidates the profile cache after the email changes', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(profileKey, profile)
    const invalidateQueries = vi.spyOn(client, 'invalidateQueries')
    vi.mocked(AccountService.updateMyEmail).mockResolvedValue(
      {} as unknown as CredentialInfo
    )
    const { result } = renderHook(() => useUpdateMyEmail(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('new@nino.delivery')

    // Assert
    await waitFor(() =>
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: profileKey })
    )
  })
})
