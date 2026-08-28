import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompanyFacade } from './useCompanyFacade'

const hook = vi.hoisted(() => () => ({
  data: undefined,
  isPending: false,
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
}))
vi.mock('@pages/Company/hooks/useCompany/useCompany', () => ({
  useCompany: hook,
}))
vi.mock('@pages/Company/hooks/useSaveCompany/useSaveCompany', () => ({
  useSaveCompany: hook,
}))

describe(useCompanyFacade.name, () => {
  it('composes the company query and save command behind one contract', () => {
    const { result } = renderHook(() => useCompanyFacade())

    expect(result.current.query).toBeDefined()
    expect(result.current.save).toBeDefined()
  })
})
