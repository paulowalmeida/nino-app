import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useRegisterWizardStore } from './register-wizard.store'
import { storeAccountMock } from './register-wizard.store.mock'

describe('useRegisterWizardStore', () => {
  beforeEach(() => act(() => useRegisterWizardStore.getState().reset()))

  it('opens on the account step with nothing filled in', () => {
    const wizard = useRegisterWizardStore.getState()

    expect(wizard.step).toBe(1)
    expect(wizard.account).toBeNull()
  })

  it('carries the account into the company step', () => {
    act(() => useRegisterWizardStore.getState().goToCompany(storeAccountMock))

    expect(useRegisterWizardStore.getState().step).toBe(2)
    expect(useRegisterWizardStore.getState().account).toBe(storeAccountMock)
  })

  it('walks back keeping the account for the fields', () => {
    act(() => useRegisterWizardStore.getState().goToCompany(storeAccountMock))
    act(() => useRegisterWizardStore.getState().goToAccount())

    expect(useRegisterWizardStore.getState().step).toBe(1)
    expect(useRegisterWizardStore.getState().account).toBe(storeAccountMock)
  })

  it('starts over when the wizard is reset', () => {
    act(() => useRegisterWizardStore.getState().goToCompany(storeAccountMock))
    act(() => useRegisterWizardStore.getState().reset())

    expect(useRegisterWizardStore.getState().step).toBe(1)
    expect(useRegisterWizardStore.getState().account).toBeNull()
  })
})
