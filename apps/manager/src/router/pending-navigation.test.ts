import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearCompletedNavigation,
  readPendingNavigation,
  recoveryTarget,
  rememberPendingNavigation,
} from './pending-navigation'
import { pendingNavigationMock } from './pending-navigation.mock'

describe('pending navigation', () => {
  beforeEach(() => sessionStorage.clear())

  it('keeps a lazy route destination until it has loaded', () => {
    const { location } = pendingNavigationMock
    rememberPendingNavigation(location)

    expect(readPendingNavigation()).toBe(
      '/unit-1/empresa/personalizar?preview=mobile#branding'
    )

    clearCompletedNavigation(location)

    expect(readPendingNavigation()).toBeNull()
  })

  it('retries the destination that was loading instead of the current route', () => {
    rememberPendingNavigation(pendingNavigationMock.location)

    expect(recoveryTarget('http://localhost:3001/unit-1/visao-geral')).toBe(
      '/unit-1/empresa/personalizar?preview=mobile#branding'
    )
  })
})
