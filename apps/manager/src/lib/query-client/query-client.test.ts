import { describe, expect, it, vi } from 'vitest'

import { queryClientMutationMetaMock } from './query-client.mock'

const { toast } = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@nino/ds/components/Toast', () => ({ toast }))

import { queryClient } from './query-client'

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

    expect(toast.success).toHaveBeenCalledWith('Pedido salvo')
  })

  it('shows the configured error message after a mutation fails', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('failed')
      },
      meta: queryClientMutationMetaMock,
    })

    await expect(mutation.execute(undefined)).rejects.toThrow('failed')
    expect(toast.error).toHaveBeenCalledWith(
      'Falha ao salvar pedido',
      'Tente de novo em instantes.'
    )
  })
})
