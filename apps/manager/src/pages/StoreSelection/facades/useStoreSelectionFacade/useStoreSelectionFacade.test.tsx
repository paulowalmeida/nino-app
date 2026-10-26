import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSelectCompany } from '@pages/StoreSelection/hooks/useSelectCompany/useSelectCompany'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'

import { useStoreSelectionFacade } from './useStoreSelectionFacade'
import { companyGroupsMock } from './useStoreSelectionFacade.mock'

vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups')
vi.mock('@pages/StoreSelection/hooks/useSelectCompany/useSelectCompany')

const selectCompany = vi.fn()

describe('useStoreSelectionFacade', () => {
  it('exposes the company groups and the selection command', () => {
    vi.mocked(useCompanyGroups).mockReturnValue(companyGroupsMock)
    vi.mocked(useSelectCompany).mockReturnValue(selectCompany)

    const { result } = renderHook(() => useStoreSelectionFacade())

    expect(result.current.companies).toBe(companyGroupsMock)
    expect(result.current.selectCompany).toBe(selectCompany)
  })
})
