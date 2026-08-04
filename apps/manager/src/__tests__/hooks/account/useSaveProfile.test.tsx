import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Profile } from '@custom_types/account'
import { profileKey } from '@hooks/account/useProfile'
import { useSaveProfile } from '@hooks/account/useSaveProfile'
import { AccountService } from '@services/account.service'

import { profile } from './useProfile.mock'

vi.mock('@services/account.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSaveProfile.name, () => {
  it('writes the saved profile into the profile cache', async () => {
    // Arrange
    const client = new QueryClient()
    const updated: Profile = { ...profile, name: 'Maria Souza' }
    vi.mocked(AccountService.updateProfile).mockResolvedValue(updated)
    const { result } = renderHook(() => useSaveProfile(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ name: 'Maria Souza' })

    // Assert
    await waitFor(() =>
      expect(client.getQueryData(profileKey)).toEqual(updated)
    )
  })
})
