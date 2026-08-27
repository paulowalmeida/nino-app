import { describe, expect, it, vi } from 'vitest'

import { goToCompany } from './go-to-company'
import { wizardAccountMock } from './go-to-company.mock'

describe('goToCompany', () => {
  it('keeps the account and opens the company step', () => {
    const set = vi.fn()

    goToCompany(set, wizardAccountMock)

    expect(set).toHaveBeenCalledWith({ step: 2, account: wizardAccountMock })
  })
})
