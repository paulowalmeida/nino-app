import { useQueryClient } from '@tanstack/react-query'
import { render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryClient } from '@lib/query-client/query-client'

import { QueryProvider } from './QueryProvider'
import {
  queryProviderChildrenMock,
  queryProviderErrorTitleMock,
  queryProviderSuccessMessageMock,
} from './QueryProvider.mock'

const toast = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}))

vi.mock('@nino/ds/components/Toast', () => ({ toast }))

afterEach(() => {
  vi.clearAllMocks()
  queryClient.clear()
})

describe(QueryProvider.name, () => {
  it('provides the application query client to descendants', () => {
    const { result } = renderHook(() => useQueryClient(), {
      wrapper: QueryProvider,
    })

    expect(result.current).toBe(queryClient)
  })

  it('renders children and forwards successful mutation notifications', async () => {
    render(
      <QueryProvider>{queryProviderChildrenMock}</QueryProvider>
    )

    expect(screen.getByText(queryProviderChildrenMock)).toBeInTheDocument()

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => undefined,
      meta: { success: queryProviderSuccessMessageMock },
    })

    await mutation.execute(undefined)

    expect(toast.success).toHaveBeenCalledWith(
      queryProviderSuccessMessageMock
    )
  })

  it('forwards failed mutation notifications with the configured error title', async () => {
    render(
      <QueryProvider>{queryProviderChildrenMock}</QueryProvider>
    )

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('failed')
      },
      meta: { errorTitle: queryProviderErrorTitleMock },
    })

    await expect(mutation.execute(undefined)).rejects.toThrow('failed')

    expect(toast.error).toHaveBeenCalledWith(
      queryProviderErrorTitleMock,
      'Tente de novo em instantes.'
    )
  })

  it('does not notify when a mutation opts out of error feedback', async () => {
    render(
      <QueryProvider>{queryProviderChildrenMock}</QueryProvider>
    )

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw new Error('failed')
      },
      meta: { silentError: true },
    })

    await expect(mutation.execute(undefined)).rejects.toThrow('failed')

    expect(toast.error).not.toHaveBeenCalled()
  })
})
