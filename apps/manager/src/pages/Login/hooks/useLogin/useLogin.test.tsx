import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLogin } from './useLogin'

const navigate = vi.fn()
const mutateAsync = vi.fn()
const mutate = vi.fn()
let onSuccess: (() => void) | undefined

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useMutation: (options: { onSuccess: () => void }) => {
      onSuccess = options.onSuccess
      return { mutateAsync, mutate }
    },
  }
})

describe(useLogin.name, () => {
  it('configures login mutation to navigate after success', () => {
    const { result } = renderHook(() => useLogin())
    expect(result.current.mutateAsync).toBe(mutateAsync)
    onSuccess?.()
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
