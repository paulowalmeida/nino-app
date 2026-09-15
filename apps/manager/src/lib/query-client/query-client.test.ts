import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  configureQueryClientMutationNotifications,
  queryClient,
} from './query-client'
import { queryClientMutationMetaMock } from './query-client.mock'

const onError = vi.fn()
const onSuccess = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  configureQueryClientMutationNotifications({ onError, onSuccess })
})

afterEach(() => {
  configureQueryClientMutationNotifications({})
  queryClient.clear()
})

describe(queryClient.constructor.name, () => {
  it('configures the application query defaults', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    })
  })

  it('shows the configured success message after a mutation', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => undefined,
      meta: queryClientMutationMetaMock,
    })

    await mutation.execute(undefined)

    expect(onSuccess).toHaveBeenCalledWith(queryClientMutationMetaMock)
  })

  it('shows the configured error message after a mutation fails', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('failed')
      },
      meta: queryClientMutationMetaMock,
    })

    await expect(mutation.execute(undefined)).rejects.toThrow('failed')
    expect(onError).toHaveBeenCalledWith(queryClientMutationMetaMock)
  })
})
