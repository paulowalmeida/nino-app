import { MemoryRouter } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSelectCompany } from './useSelectCompany'
import { selectCompanyUnitsMock } from './useSelectCompany.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))

describe('useSelectCompany', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the current unit of the chosen company', () => {
    const { result } = renderHook(() => useSelectCompany(), {
      wrapper: MemoryRouter,
    })

    result.current(selectCompanyUnitsMock)

    expect(navigate).toHaveBeenCalledWith('/unit-2/visao-geral')
  })

  it('falls back to the first unit when none is current', () => {
    const { result } = renderHook(() => useSelectCompany(), {
      wrapper: MemoryRouter,
    })
    const noCurrent = selectCompanyUnitsMock.map((unit) => ({
      ...unit,
      isCurrent: false,
    }))

    result.current(noCurrent)

    expect(navigate).toHaveBeenCalledWith('/unit-1/visao-geral')
  })
})
