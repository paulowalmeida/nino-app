import { describe, expect, it } from 'vitest'

import { unitSwitchPath } from './unit-switch-path'
import { cashierMock, catalogManagerMock } from './unit-switch-path.mock'

describe('unitSwitchPath', () => {
  it('keeps the section in the other unit', () => {
    expect(unitSwitchPath('/unit-1/produtos', catalogManagerMock)).toBe(
      '/unit-2/produtos'
    )
  })

  it('drops a detail back to the section list', () => {
    expect(unitSwitchPath('/unit-1/produtos/abc-123', catalogManagerMock)).toBe(
      '/unit-2/produtos'
    )
  })

  it('falls back to the overview without permission in the other unit', () => {
    expect(unitSwitchPath('/unit-1/produtos', cashierMock)).toBe(
      '/unit-2/visao-geral'
    )
  })

  it('falls back to the overview for a section outside the menu', () => {
    expect(unitSwitchPath('/unit-1/nao-existe', catalogManagerMock)).toBe(
      '/unit-2/visao-geral'
    )
  })
})
